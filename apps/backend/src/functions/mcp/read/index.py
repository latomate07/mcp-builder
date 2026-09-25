import json
import boto3
from validations.McpValidation import McpValidation
from services.McpService import McpService

def handler(event, context):
    """
    AWS Lambda handler for MCP read events.
    """

    try:
        mcp_id = (event.get("pathParameters") or {}).get("mcpId")
        if not mcp_id:
            raise ValueError("Missing 'mcp_id' in request body")

        mcpService = McpService(dynamodb_client=boto3.client("dynamodb"))
        mcp_data = mcpService.get_mcp_by_id(mcp_id)

        if not mcp_data:
            return {
                "statusCode": 404,
                "body": json.dumps({"error": "MCP not found"}),
            }

    except Exception as e:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": str(e)}),
        }           


    return {
        "statusCode": 200,
        "body": json.dumps({"mcp_data": mcp_data}),
    }