# Roadmap — MCP Builder

Fichier vivant : coche les cases au fur et à mesure (`- [ ]` → `- [x]`), ajoute des notes sous
chaque tâche si besoin, ouvre une issue par milestone si tu veux tracker ça sur GitHub en plus.

**Ordre de marche voulu** : backend/infra d'abord (M0 → M6), 100% testé en local contre `floci`,
puis on branche `apps/web` (déjà mocké, déjà prêt) en dernier (M7), puis un vrai déploiement AWS
(M8). La piste VPC (M9) est volontairement à part — elle ne bloque rien.

Stack retenue : **serverless de bout en bout** — API Gateway (HTTP API) + Lambda + Cognito (JWT
authorizer) + DynamoDB + Secrets Manager + SQS. Voir l'addendum en tête de
[`docs/aws-architecture.md`](./aws-architecture.md) pour le pourquoi.

---

## Vue d'ensemble

| Milestone | Sujet | Statut |
|---|---|---|
| M0 | Cognito local (floci) + tooling | ⬜ |
| M1 | Tables DynamoDB (schéma control-plane) | ⬜ |
| M2 | `packages/openapi-parser` | ⬜ |
| M3 | `packages/mcp-runtime` | ⬜ |
| M4 | Control-plane API (Lambda + API Gateway + Cognito) | ⬜ |
| M5 | Pipeline de déploiement (SQS + deploy-worker) | ⬜ |
| M6 | Observabilité (logs & metrics par serveur) | ⬜ |
| M7 | Brancher `apps/web` (front déjà prêt) | ⬜ |
| M8 | Déploiement AWS réel (compte `dev`) | ⬜ |
| M9 | Piste VPC (pratique réseau, en parallèle/à part) | ⬜ |

---

## M0 — Cognito local + tooling de base

Objectif : pouvoir créer un compte, se logger, obtenir un JWT — 100% en local contre `floci`.

- [ ] Démarrer `floci` seul (`docker compose up -d floci floci-ui`) et vérifier `cognito-idp` répond
      (`aws --endpoint-url http://localhost:4566 cognito-idp list-user-pools --max-results 10`)
- [ ] Créer le User Pool + App Client via Terraform (nouveau fichier `terraform/cognito.tf` ou
      module `terraform/modules/auth/`)
  - [ ] `aws_cognito_user_pool` (attributs : email, obligatoire ; vérification email désactivée en
        local pour aller vite)
  - [ ] `aws_cognito_user_pool_client` (flow `USER_PASSWORD_AUTH` pour tester au CLI facilement,
        + flow `AUTHORIZATION_CODE` avec Hosted UI pour le vrai flow front plus tard)
  - [ ] `aws_cognito_user_pool_domain` (nécessaire pour la Hosted UI)
- [ ] Script ou commande `just`/`make`/`npm run` pour créer un utilisateur de test et récupérer un
      `id_token`/`access_token` en une commande (`aws cognito-idp admin-create-user` +
      `admin-set-user-password` + `initiate-auth`)
- [ ] Documenter les 3 commandes dans `terraform/README.md`

**Definition of done** : tu obtiens un JWT valide depuis `floci`, tu peux le décoder (jwt.io) et
voir `sub`, `email`, `exp`.

---

## M1 — Schéma DynamoDB (control-plane)

Objectif : les données qui remplacent `apps/web/src/lib/mock-data.ts`, en respectant les types déjà
définis dans `apps/web/src/types/mcp.ts` (ne pas les réinventer, c'est le contrat front↔back).

- [ ] Décider single-table vs tables séparées — **conseil : commence par des tables séparées**
      (plus lisible pour toi et en entretien), tu pourras migrer en single-table design plus tard
      si tu veux un point de discussion technique en plus
- [ ] Table `Servers` — PK `serverId`, attributs = `McpServer` sans `tools`/`secrets` (qui vivent
      ailleurs) : `status`, `sseEndpoint`, `region`, `runtime`, `vCpu`, `memoryMb`, `customDomain`…
- [ ] Table `Tools` — PK `serverId`, SK `toolId` (relation 1-N propre, requête "tous les tools d'un
      serveur" en un `Query`)
- [ ] Table `BearerTokens` — PK `serverId`, SK `tokenId` (le token lui-même = clé API Gateway ou
      secret généré, jamais stocké en clair après création si possible)
- [ ] Table `Secrets` — **uniquement les métadonnées** (`key`, `description`, `updatedAt`) ; la
      **valeur** part directement dans Secrets Manager (`/mcp/{serverId}/{key}`), jamais en
      DynamoDB
- [ ] Table `Accounts` — PK `userId` (= `sub` Cognito), mappe `AccountSettings`
- [ ] Terraform pour les 5 tables, `billing_mode = PAY_PER_REQUEST` (comme l'existant dans
      `terraform/main.tf`)
- [ ] `terraform apply` contre `floci`, vérifier dans `floci-ui` (http://localhost:4500) que les
      tables existent

**Definition of done** : les 5 tables existent dans `floci`, tu peux y écrire/lire un item au CLI
(`aws dynamodb put-item` / `get-item`).

---

## M2 — `packages/openapi-parser`

Objectif : transformer un spec OpenAPI (JSON/YAML) en `McpTool[]` (le type existe déjà).

- [ ] Setup du package (`package.json`, `tsconfig.json`, build vers `dist/` ou `tsup`)
- [ ] Parser : lire `paths` + `operationId`/`summary`/`parameters` → générer un `McpTool` par
      opération (nom = `operationId` en snake_case, `params` depuis les `parameters`/`requestBody`)
- [ ] Générer un `HttpExecutionConfig` par défaut (méthode + URL template depuis le path + les
      `servers[0].url` du spec)
- [ ] Gérer au minimum : paramètres query/path, un `requestBody` JSON simple, les types
      string/number/boolean/array
- [ ] Tests unitaires avec 2-3 specs d'exemple (le mock JSON déjà présent dans
      `apps/web/src/app/servers/new/page.tsx` est un bon point de départ, plus un spec Stripe/GitHub
      réel simplifié)
- [ ] `README.md` du package avec un exemple d'usage

**Definition of done** : `parseOpenApi(spec) → McpTool[]` fonctionne sur au moins 2 specs
différentes et le résultat matche le type `McpTool` sans `any`.

---

## M3 — `packages/mcp-runtime`

Le cœur du produit : le moteur qui transforme une config serveur (tools + secrets) en un vrai
serveur MCP. **Découpe en deux modes d'exécution** comme le prévoit déjà `ExecutionMode` :

- [ ] Setup du package
- [ ] Implémenter le protocole MCP côté transport : endpoint HTTP + **SSE / streamable HTTP** (le
      SDK officiel `@modelcontextprotocol/sdk` gère déjà le protocole — ne pas le réécrire à la
      main, s'en servir comme dépendance)
- [ ] Enregistrement dynamique des tools MCP à partir d'un tableau `McpTool[]` (nom, description,
      schema de params → JSON Schema attendu par MCP)
- [ ] **Mode `http`** : exécuter un `HttpExecutionConfig` (interpoler l'URL/headers/body avec les
      params reçus + les secrets résolus, faire l'appel, retourner la réponse)
- [ ] **Mode `code`** : exécuter un `CodeExecutionConfig` — commence simple (juste `eval`/`vm`
      Node en local pour la Sandbox de dev), le vrai sandboxing fort (isolation Lambda) vient à M5,
      pas la peine de le sur-ingénierer ici
- [ ] Résolution des secrets : interface `SecretResolver` (implémentation "process.env" en local
      pour dev, implémentation "Secrets Manager" pour la prod — ne jamais coder en dur le choix)
- [ ] Point d'entrée double :
  - [ ] `runLocal(config)` → petit serveur HTTP local, pour tester dans l'onglet **Sandbox** du
        front (`apps/web/src/app/servers/[id]/sandbox`) avant tout déploiement AWS
  - [ ] `handler(event, context)` → export compatible Lambda (utilisé par M5)
- [ ] Logging structuré (JSON, un objet par appel de tool) — c'est ce flux qui alimentera M6

**Definition of done** : un script local peut charger un `McpServer` mocké depuis
`mock-data.ts`, démarrer le runtime, et un client MCP (Claude Desktop configuré en local, ou le
inspector officiel `@modelcontextprotocol/inspector`) peut lister les tools et en appeler un en
mode `http`.

---

## M4 — Control-plane API (Lambda + API Gateway + Cognito)

Objectif : les routes CRUD que `apps/web` appellera à la fin (M7). `apps/api` devient le code de
ces Lambdas.

- [ ] Choisir un micro-framework de routage léger dans la Lambda (ex. Hono — supporte nativement
      l'adaptateur Lambda et évite de réinventer un router)
- [ ] Routes serveurs : `GET/POST /servers`, `GET/PATCH/DELETE /servers/{id}`
- [ ] Routes tools : `GET/POST /servers/{id}/tools`, `PATCH/DELETE /servers/{id}/tools/{toolId}`
- [ ] Routes secrets : `POST/DELETE /servers/{id}/secrets/{key}` → écrit/supprime dans Secrets
      Manager, ne renvoie jamais la valeur en `GET` (seulement les métadonnées, comme prévu dans
      M1)
- [ ] Routes bearer tokens : `POST/DELETE /servers/{id}/tokens`
- [ ] Routes account : `GET/PATCH /me`
- [ ] API Gateway HTTP API en Terraform, une route = une intégration Lambda (ou une seule Lambda
      "monolithe" avec Hono qui route en interne — plus simple à déployer, tout aussi valable pour
      ce stade du projet)
- [ ] **JWT authorizer** API Gateway branché sur le User Pool Cognito de M0 (valide le token, pas
      besoin de vérifier la signature à la main dans le code Lambda)
- [ ] IAM : un rôle d'exécution par Lambda, scope minimal (cette Lambda ne touche que ses propres
      tables DynamoDB + Secrets Manager sous `/mcp/*`)
- [ ] Tester chaque route au `curl`/`httpie` avec un vrai JWT sorti de M0

**Definition of done** : depuis `curl` avec un JWT Cognito valide dans `Authorization: Bearer …`,
tu peux créer un serveur, y ajouter un tool, poser un secret, lister le tout — et un appel sans
token (ou expiré) reçoit un `401` de l'API Gateway lui-même (pas de ta Lambda).

---

## M5 — Pipeline de déploiement (SQS + deploy-worker)

Objectif : la partie "4x plus rapide" du pitch — transformer un `POST /servers` en un vrai endpoint
MCP live, de façon asynchrone.

- [ ] Sur `POST /servers` (et sur update de tools/secrets) : la Lambda M4 envoie un message SQS
      `{ serverId }`, met `status = "deploying"` dans DynamoDB, répond tout de suite (pas
      d'attente synchrone)
- [ ] Lambda `deploy-worker`, déclenchée par SQS :
  - [ ] Charge la config serveur + tools depuis DynamoDB, les secrets depuis Secrets Manager
  - [ ] Packages/déploie une Lambda **par serveur tenant**, qui embarque `packages/mcp-runtime`
        avec cette config (variable d'env = juste l'ARN des secrets, jamais la valeur)
  - [ ] Crée/actualise une **Function URL** en `InvokeMode: RESPONSE_STREAM` sur cette Lambda
        tenant (c'est ce qui permet le SSE)
  - [ ] Crée le CloudWatch Log group dédié `/mcp/{serverId}`
  - [ ] Met à jour DynamoDB : `status = "active"`, `sseEndpoint = <function-url>`
- [ ] Gestion d'erreur : si le déploiement échoue, `status = "error"` + message d'erreur stocké,
      pas de retry infini (DLQ SQS après 3 tentatives)
- [ ] Tester en local : créer un serveur via M4, observer dans `floci-ui` la Lambda tenant
      apparaître, appeler son endpoint

**Definition of done** : de `POST /servers` (via curl) à un endpoint MCP appelable, sans aucune
étape manuelle — le tout contre `floci`.

---

## M6 — Observabilité (logs & metrics par serveur)

Objectif : remplir les types `LogEntry` et `ServerMetrics` avec de la vraie donnée.

- [ ] `mcp-runtime` (M3) logge déjà en JSON structuré → un log CloudWatch par appel de tool, avec
      les champs de `LogEntry` (timestamp, toolName, clientType si dispo dans les headers MCP,
      status, durationMs)
- [ ] Route `GET /servers/{id}/logs` (M4) : requête CloudWatch Logs Insights directement (pas
      besoin d'un pipeline séparé à ce stade — Logs Insights suffit pour du portfolio/MVP)
- [ ] Route `GET /servers/{id}/metrics` : calcul à la volée depuis Logs Insights (count, success
      rate, latence moyenne) — optimisation en rollups DynamoDB seulement si la latence de cette
      route devient un problème réel
- [ ] Alarme CloudWatch basique sur le taux d'erreur `deploy-worker` (bon réflexe pro à montrer en
      entretien, coûte 5 minutes à faire)

**Definition of done** : l'onglet Logs & Traces d'un serveur réel (via curl sur `/logs`) renvoie
des entrées qui matchent exactement le type `LogEntry`.

---

## M7 — Brancher `apps/web` (le front est déjà prêt)

Objectif : remplacer le mock par du réel, **sans retoucher les composants UI**.

- [ ] Auth côté front : NextAuth avec le provider Cognito (OAuth2 code flow contre la Hosted UI de
      M0), exposer l'`access_token` Cognito brut dans la session NextAuth (callback `jwt`)
- [ ] Un client API (`apps/web/src/lib/api-client.ts`) : wrapper `fetch` qui pointe vers l'URL de
      l'API Gateway (variable d'env `NEXT_PUBLIC_API_URL`) et ajoute
      `Authorization: Bearer <access_token>`
- [ ] Remplacer, un par un, les usages de `mock-data.ts` dans `context/mcp-context.tsx` par des
      appels au client API — le contexte garde la même forme, donc **aucun composant enfant ne
      change**
- [ ] Garder `mock-data.ts` uniquement comme seed de dev (utilisable en mode démo/offline)
- [ ] Page de login/callback NextAuth (`apps/web/src/app/api/auth/[...nextauth]`)
- [ ] Vérifier chaque page (`servers`, `servers/[id]/tools`, `.../secrets`, `.../sandbox`,
      `.../logs`, `settings`) avec les vraies données

**Definition of done** : le dashboard tourne contre l'API réelle (encore sur `floci` à ce stade),
zéro mock actif, login Cognito fonctionnel de bout en bout.

---

## M8 — Déploiement AWS réel (compte `dev`)

- [ ] Compte AWS dédié (ou a minima un OU distinct), budget alert dès le jour 1 (AWS Budgets, seuil
      bas — ex. 10€)
- [ ] `terraform/provider.tf` : nouveau backend (S3 + DynamoDB lock table), variables d'env pour
      `dev` vs `floci`
- [ ] `terraform apply` du même code que contre `floci`, cette fois en vrai
- [ ] GitHub Actions : OIDC provider + rôle de déploiement (zéro clé AWS en secret GitHub), workflow
      `plan` sur PR / `apply` sur merge `main`
- [ ] Nom de domaine + Route 53 + ACM pour l'API Gateway et le front (si tu déploies `apps/web`
      aussi — sinon Vercel en attendant, pas besoin de tout mettre sur AWS pour le front tout de
      suite)
- [ ] Vérifier le coût réel après une semaine dans Cost Explorer, comparer à l'estimation de
      `docs/aws-architecture.md` §11

**Definition of done** : l'app tourne sur un vrai compte AWS, joignable depuis internet, avec un
pipeline CI/CD qui déploie sans intervention manuelle.

---

## M9 — Piste VPC (pratique réseau, en parallèle ou après)

Découplée du chemin critique (voir addendum en tête de `docs/aws-architecture.md`) — à faire quand
tu veux un sujet réseau pur, ou pour enrichir le projet avec une vraie feature qui en a besoin.

- [ ] VPC 2 AZ, 3 tiers de subnets (public / app privé / data privé), comme décrit dans
      `docs/aws-architecture.md` §4
- [ ] NAT Gateway + route tables, vérifier avec VPC Reachability Analyzer
- [ ] VPC endpoints (S3, DynamoDB en gateway ; Secrets Manager, ECR, CloudWatch Logs en interface)
      et observer la baisse du trafic NAT
- [ ] VPC Flow Logs → CloudWatch
- [ ] **Feature réelle qui justifie le VPC** : ex. Aurora Serverless v2 privé + une Lambda "tool"
      capable de requêter une base Postgres, pour un template `PostgreSQL Data Explorer` (déjà
      présent en mock dans `mock-data.ts` — bel exemple concret à brancher)
- [ ] Terraform : remplir `terraform/modules/vpc/` (actuellement vide)

**Definition of done** : un module VPC Terraform réutilisable, appliqué à un vrai compte, avec au
moins une charge de travail privée dedans (pas juste des tuyaux vides).

---

## Notes pour l'entretien

Chaque milestone correspond à une réponse concrète à "raconte-moi un projet" :
M4/M5 = design d'API serverless multi-tenant, M3 = tu as intégré/adapté le SDK officiel MCP,
M6 = observabilité pensée dès le départ, M8 = tu sais livrer par CI/CD avec OIDC (pas de clés en
dur), M9 = tu sais concevoir un VPC de zéro, pas juste cliquer sur "créer une VPC" dans la console.
