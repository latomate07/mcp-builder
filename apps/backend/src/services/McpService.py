import datetime
import os
import uuid

class McpService:
    def __init__(self, dynamodb_client):
        self.db_client = dynamodb_client
        self.mcps_table = os.environ["MCPS_TABLE_NAME"]
        self.mcps_monitoring_table = os.environ["MCPS_MONITORING_TABLE_NAME"]

    def get_all_mcps(self):
        response = self.db_client.scan(TableName=self.mcps_table)
        return response.get("Items", [])

    def get_mcp_by_id(self, mcp_id):
        response = self.db_client.get_item(
            TableName=self.mcps_table,
            Key={"Id": {"S": mcp_id}}
        )
        return response.get("Item", None)

    def create_mcp(self, mcp_data):
        random_id = str(uuid.uuid4())
        mcp_data["Id"] = random_id
        mcp_data["CreatedAt"] = datetime.datetime.utcnow().isoformat()
        mcp_data["UpdatedAt"] = datetime.datetime.utcnow().isoformat()

        response = self.db_client.put_item(
            TableName=self.mcps_table,
            Item={
                "Id": {"S": mcp_data["Id"]},
                "Name": {"S": mcp_data["Name"]},
                "Description": {"S": mcp_data.get("Description", "")},
                "Runtime": {"S": mcp_data["Runtime"]},
                "Region": {"S": mcp_data["Region"]},
                "vCPU": {"N": str(mcp_data["vCPU"])},
                "RAM": {"N": str(mcp_data["RAM"])},
                "Timeout": {"N": str(mcp_data["Timeout"])},
                "CreatedAt": {"S": mcp_data["CreatedAt"]},
                "UpdatedAt": {"S": mcp_data["UpdatedAt"]},
            }
        )
        return response

    def log_mcp_monitoring_data(self, mcp_id, monitoring_data):
        response = self.db_client.put_item(
            TableName=self.mcps_monitoring_table,
            Item={
                "Id": {"S": monitoring_data["Id"]},
                "McpId": {"S": mcp_id},
                "CPUUsage": {"N": str(monitoring_data["CPUUsage"])},
                "MemoryUsage": {"N": str(monitoring_data["MemoryUsage"])},
                "DiskUsage": {"N": str(monitoring_data["DiskUsage"])},
                "Timestamp": {"S": monitoring_data["Timestamp"]},
                "ExpiresAt": {"N": str(int(datetime.utcnow().timestamp()) + 604800)},  # Set TTL for 1 week later
            }
        )
        return response