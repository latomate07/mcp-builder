def handle(event, context):
    return {
        "statusCode": 200,
        "body": f'Hello, World! You sent this request: {event}.'
    }