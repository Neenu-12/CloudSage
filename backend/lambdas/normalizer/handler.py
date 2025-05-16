
import json
import boto3
import os
from datetime import timedelta
from momento import CacheClient, Configurations, CredentialProvider
from momento.responses import CacheGet

secretsmanager_client = boto3.client("secretsmanager")

CACHE_NAME = "normalizer"
INDEX_KEY = "ec2:active-instances"

def lambda_handler(event, context):
    print("This is event", event)

    timestamp = event['time']
    region = event['region']
    instance_id = event['detail']['instance-id']
    state = event['detail']['state']

    key = f"ec2:latest:{instance_id}"
    value = {
        "instance_id": instance_id,
        "state": state,
        "timestamp": timestamp,
        "region": region
    }

    secret = secretsmanager_client.get_secret_value(SecretId="momento/cache_api_key")
    momento_api_key = json.loads(secret['SecretString'])['key']
    
    momento_client = create_client(momento_api_key)

    try:
        result = momento_client.set(CACHE_NAME, key, json.dumps(value))
        print(f"Stored event record for {instance_id}")

        update_active_index(momento_client, instance_id, state)

    except Exception as e:
        print(f"Failed to write to cache: {str(e)}")
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }

def create_client(momento_api_key):
  momento_api_key = momento_api_key
  config = {
    'configuration': Configurations.Laptop.v1(),
    'credential_provider': CredentialProvider.from_string(momento_api_key),
    'default_ttl': timedelta(seconds=86400)
  }
  return CacheClient.create(**config)

def update_active_index(momento_client, instance_id, state):
    try:
        get_resp = momento_client.get(CACHE_NAME, INDEX_KEY)
        if isinstance(get_resp, CacheGet.Hit):
            ids = set(get_resp.value_string.split(","))
        else:
            ids = set()

        if state == "running":
            ids.add(instance_id)
        elif state == "stopped":
            ids.discard(instance_id)

        momento_client.set(CACHE_NAME, INDEX_KEY, ",".join(ids))
    except Exception as e:
        print(f"Error updating instance index: {str(e)}")
