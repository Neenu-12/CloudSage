import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('cloudSagedb')

def lambda_handler(event, context):
    item_list = []
    try:
        response = table.scan()
        item_list.extend(response['Items'])

        while 'LastEvaluatedKey' in response:
            response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
            item_list.extend(response['Items'])

        for item in item_list:
            try:
                item['recommendation'] = json.loads(item['recommendation'])
                item['reasoning'] = json.loads(item['reasoning'])
            except json.JSONDecodeError:
                print("Error decoding JSON in item:", item)
    except Exception as e:
        print("Exception Occured: ", str(e))

    return {
        'statusCode': 200,
        'body': item_list
    }
