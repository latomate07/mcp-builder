data "aws_iam_policy_document" "assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda_execution_role" {
  name               = "lambda_execution_role-${var.infra_environment}"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
  tags               = local.common_tags
}

# Grants logs:CreateLogGroup / CreateLogStream / PutLogEvents so the Lambda
# can actually write to CloudWatch. Without this, the function can fail
# silently with no trace anywhere.
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# LocalStack doesn't enforce IAM by default, so the auth Lambda's Cognito
# calls (sign_up, admin_get_user, admin_confirm_sign_up) worked without
# this — but they'd fail with AccessDeniedException on real AWS.
data "aws_iam_policy_document" "cognito_access" {
  statement {
    effect = "Allow"
    actions = [
      "cognito-idp:SignUp",
      "cognito-idp:AdminGetUser",
      "cognito-idp:AdminConfirmSignUp",
    ]
    resources = [aws_cognito_user_pool.control_panel_user_pool.arn]
  }
}

resource "aws_iam_role_policy" "cognito_access" {
  name   = "cognito-access-${var.infra_environment}"
  role   = aws_iam_role.lambda_execution_role.id
  policy = data.aws_iam_policy_document.cognito_access.json
}
