import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: "#0c0c0c",
          panel: "#121212",
          sidebar: "#171717",
          card: "#181818",
          cardHover: "#1f1f1f",
          border: "#232323",
          borderLight: "#2e2e2e",
          accent: "#282828",
        },
        brand: {
          DEFAULT: "#3ECF8E",
          emerald: "#3ECF8E",
          emeraldDark: "#24B47E",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#3ECF8E",
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#1f1f1f",
          foreground: "#ededed",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#1f1f1f",
          foreground: "#a1a1aa",
        },
        accent: {
          DEFAULT: "#282828",
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "#171717",
          foreground: "#ededed",
        },
        card: {
          DEFAULT: "#181818",
          foreground: "#ededed",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
