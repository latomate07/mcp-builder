data "archive_file" "hello_world" {
  type        = "zip"
  source_file = "${path.root}/../apps/backend/src/functions/hello_world/index.py"
  output_path = "${path.root}/build/lambda/function.zip"
}

resource "aws_lambda_function" "hello_world" {
  filename      = data.archive_file.hello_world.output_path
  function_name = "hello_world_lambda_function"
  role          = aws_iam_role.hello_world.arn
  handler       = "index.handler"
  runtime       = var.lambda_runtime
  code_sha256   = data.archive_file.hello_world.output_base64sha256
}
