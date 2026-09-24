from pydantic import BaseModel

class McpValidation(BaseModel):
    name: str
    description: str
    runtime: str
    region: str
    mcpEnvironment: str
    vCpu: int = 0.5 # in vCPU
    ram: int = 1024 # in MB
    timeout: int = 60 # in seconds