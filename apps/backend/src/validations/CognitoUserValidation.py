from pydantic import BaseModel

class CognitoUserValidation(BaseModel):
    username: str
    password: str
    email: str