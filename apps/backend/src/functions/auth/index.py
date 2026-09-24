import os
import boto3
import json
from pydantic import ValidationError
from botocore.exceptions import ClientError
from validations.CognitoUserValidation import CognitoUserValidation
from services.CognitoIdentityProvider import CognitoIdentityProvider

cognito_idp_provider = CognitoIdentityProvider(
    cognito_idp_client=boto3.client("cognito-idp"),
    user_pool_id=os.environ["COGNITO_USER_POOL_ID"],
    client_id=os.environ["COGNITO_APP_CLIENT_ID"],
    client_secret=os.environ.get("COGNITO_APP_CLIENT_SECRET"),
    auto_confirm_user=True # TODO: Consider making this configurable via environment variable or parameter
)

def handler(event, context):
    """
    AWS Lambda handler for authentication events.
    """

    try:
        body = json.loads(event.get("body") or "{}")
        validated_data = CognitoUserValidation(**body)
    except (json.JSONDecodeError, ValidationError) as e:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Invalid request body", "details": str(e)}),
        }

    try:
        result = cognito_idp_provider.sign_up_user(
            user_name=validated_data.username,
            password=validated_data.password,
            user_email=validated_data.email,
        )
    except ClientError as err:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": err.response["Error"]["Message"]}),
        }

    print(f"Sign-up result: {result}")

    return {
        "statusCode": 200,
        "body": json.dumps({"message": "Authentication successful"}),
    }