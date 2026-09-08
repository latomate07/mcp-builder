output "dev_vpc_id" {
  value = aws_vpc.dev.id
}

output "staging_vpc_id" {
  value = aws_vpc.staging.id
}

output "prod_vpc_id" {
  value = aws_vpc.prod.id
}