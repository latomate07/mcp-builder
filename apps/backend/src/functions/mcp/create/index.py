import json
import boto3
from validations.McpValidation import McpValidation
from services.McpService import McpService
import os

def handler(event, context):
    """
    AWS Lambda handler for MCP creation events.
    """

    data = json.loads(event.get("body") or "{}")
    mcpService = McpService(dynamodb_client=boto3.client("dynamodb"))

    print(f"Received data: {json.dumps(data)}")

    try:
        newMcp = McpValidation(**data)
        mcpService.create_mcp({
            "Name": newMcp.name,
            "Description": newMcp.description,
            "Runtime": newMcp.runtime,
            "Region": os.environ.get("AWS_REGION", "us-east-1"),
            "vCPU": newMcp.vCpu,
            "RAM": newMcp.ram,
            "Timeout": newMcp.timeout,
            "McpEnvironment": os.environ.get("MCP_ENVIRONMENT", "dev"),
        })

    except Exception as e:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": str(e)}),
        }
    

    return {
        "statusCode": 200,
        "body": json.dumps({"message": f"MCP {newMcp.name} created successfully"}),
    }