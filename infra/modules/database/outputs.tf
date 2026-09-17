output "db_name" {
    value = aws_db_instance.mcpbuilder_database.db_name
}

output "db_endpoint" {
    value = aws_db_instance.mcpbuilder_database.endpoint
}

output "db_arn" {
    value = aws_db_instance.mcpbuilder_database.arn
}

output "database_sg_id" {
    value = aws_security_group.database_sg.id
}