import json

def handler(event, context):
    message = f'Hello, World! You sent this request: {json.dumps(event)}.'
    return {
        "statusCode": 200,
        "body": json.dumps({"message": message})
    }