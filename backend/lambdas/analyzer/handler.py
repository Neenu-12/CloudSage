import json
import boto3
from datetime import datetime, timezone, timedelta
from momento import CacheClient, Configurations, CredentialProvider
from momento.responses import CacheGet

secretsmanager_client = boto3.client("secretsmanager")
cloudwatch_client = boto3.client('cloudwatch')
bedrock_client = boto3.client("bedrock-runtime")
ec2 = boto3.client('ec2')
dynamodb = boto3.client("dynamodb")

CACHE_NAME = "normalizer"
INDEX_KEY = "ec2:active-instances"
METRIC_NAMESPACE = "AWS/EC2"
METRICS = ["CPUUtilization"]
DYNAMODB_TABLE = 'cloudSagedb'

def lambda_handler(event, context):
    momento_api_key = get_momento_key()
    momento_client = create_momento_client(momento_api_key)

    index_resp = momento_client.get(CACHE_NAME, INDEX_KEY)

    if isinstance(index_resp, CacheGet.Hit):
        instance_ids = index_resp.value_string.split(",")
    else:
        print("No active instances found.")
        return

    for instance_key in instance_ids:
        instance_resp = momento_client.get(CACHE_NAME, f"ec2:latest:{instance_key}")
        if not isinstance(instance_resp, CacheGet.Hit):
            continue
        
        # Step 1: Get attributes
        try:
            instance_data = json.loads(instance_resp.value_string)
            instance_id = instance_data["instance_id"]
            start_time = datetime.fromisoformat(instance_data["timestamp"].replace("Z", "+00:00"))
            region = instance_data["region"]

            now = datetime.now(timezone.utc)
            uptime = now - start_time

            instance_type = ec2.describe_instance_attribute(InstanceId=instance_data["instance_id"], \
                                                            Attribute='instanceType')['InstanceType'] \
                                                            ['Value']

            # Step 2: Get CloudWatch metrics
            recent_stats = get_metric_stats(instance_id, METRICS[0], \
                                            start_time=now - timedelta(hours=1), period=300)

            daily_avg_stats = get_metric_stats(instance_id, METRICS[0], \
                                               start_time=now - timedelta(hours=24), period=3600)

            # Step 3: Generate prompt
            prompt = generate_prompt(instance_id, region, uptime, recent_stats, \
                                     daily_avg_stats, instance_type)

            # Step 4: Call Bedrock
            bedrock_response = invoke_bedrock(prompt)

            sanitized_response = bedrock_response.removeprefix("```json\n").removesuffix("\n```")

            response = store_recommendation(sanitized_response,region,start_time,now, \
                                            uptime,instance_id)
            print(response)
        except Exception as e:
            print(f"Error processing instance {instance_key}: {str(e)}")

    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }

def get_momento_key():
    secret = secretsmanager_client.get_secret_value(SecretId="momento/cache_api_key")
    return json.loads(secret['SecretString'])['key']

def create_momento_client(momento_api_key):
  momento_api_key = momento_api_key
  config = {
    'configuration': Configurations.Laptop.v1(),
    'credential_provider': CredentialProvider.from_string(momento_api_key),
    'default_ttl': timedelta(seconds=86400) # one day
  }
  return CacheClient.create(**config)

def get_metric_stats(instance_id, metric_name, start_time, period):
    end_time = datetime.now(timezone.utc)

    resp = cloudwatch_client.get_metric_statistics(
        Namespace=METRIC_NAMESPACE,
        MetricName=metric_name,
        Dimensions=[{'Name': 'InstanceId', 'Value': instance_id}],
        StartTime=start_time,
        EndTime=end_time,
        Period=period,
        Statistics=['Average']
    )

    datapoints = sorted(resp['Datapoints'], key=lambda x: x['Timestamp'])

    return [round(dp['Average'], 2) for dp in datapoints]

def generate_prompt(instance_id, region, uptime, recent_metrics, daily_metrics, instance_type):
    avg_recent = sum(recent_metrics)/len(recent_metrics) if recent_metrics else 0
    avg_daily = sum(daily_metrics)/len(daily_metrics) if daily_metrics else 0

    return f"""\n\nHuman:
    You are a cloud infrastructure optimization advisor.

    Analyze the following EC2 instance and recommend a single best action to reduce cost and 
    improve sustainability. Your response must be based on real-time AWS pricing and realistic
    power consumption calculated (not assumed) from hardware-level estimates, and allow multiple 
    levels of downscaling — not just one tier.

    - Instance ID: {instance_id}
    - Region: {region}
    - Uptime: {uptime}
    - CPU Utilization (last hour): {avg_recent:.2f}%
    - CPU Utilization (24-hour average): {avg_daily:.2f}%
    - InstanceType: {instance_type}

    Assumptions:
    - The instance runs 24 hours per day.
    - AWS on-demand pricing must be fetched from live sources as of today's date.
    - CO₂ emission factor = 500 grams per kWh
    - Estimate daily energy consumption in kWh using this formula:
        kWh/day= Estimated Watts (based on vCPU, RAM, hardware type)×24 / 1000
    - Estimate power draw using realistic per-vCPU and per-RAM wattage models:
        - Idle or low CPU vCPU draw ≈ 2-3W per vCPU for older gen (Xen), ≈ 0.8-1.5W for newer 
          (Nitro)
        - RAM draw ≈ 0.5W per GiB
        - Add ~1-2W for virtualization/network/storage overhead
    - Avoid hardcoded power values — perform calculations

    Instructions:
    1. Recommend **only one primary action**: [Keep Running, Stop, Resize]
    2. Explain your reasoning briefly
    3. Estimate both:
        - Daily cost savings (USD)
        - Cost savings percentage
        - CO₂ savings in grams/day
        - CO₂ savings percentage
    4. Recommend Stop only if:
        - CPU avg < 5% over 24h
        - Uptime > 1 day
        - No sign of future load or critical system role

    Present your response in a json format: where first element has key as "recommendations" and it's 
    value has the following keys i.e. "action", "reason", "suggested_instance_type" (if applicable),
    "estimated_savings_usd_per_day", "percent_cost_savings", "estimated_co2_savings_grams_per_day",
    "percent_co2_savings", "aws_service_type". Second element has key as "reasoning" and value as
    all list of reasoning you have produced

    \n\nAssistant:"""

def invoke_bedrock(prompt):

    body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 3000,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt
                    }
                ]
            }
        ]
    }

    response = bedrock_client.invoke_model(
        modelId="anthropic.claude-3-sonnet-20240229-v1:0",
        body=json.dumps(body),
        contentType="application/json",
        accept="application/json"
    )

    response_body = json.loads(response["body"].read().decode())
    completion = response_body["content"][0]["text"]

    return completion

def store_recommendation(sanitized_response,region,start_time,now,uptime,instance_id):

    response_json = json.loads(sanitized_response)

    recommendations = response_json['recommendations']
    reasoning = response_json['reasoning']

    recommendations["region"] = region
    recommendations["start_time"] = start_time.isoformat()
    recommendations["now"] = now.isoformat()
    recommendations["uptime"] = str(uptime)
    recommendations["instance_id"] = instance_id

    response = dynamodb.put_item(
    TableName=DYNAMODB_TABLE,
    Item={
        'instance-id': {'S': instance_id},
        'recommendation': {'S': json.dumps(recommendations)},
        'reasoning': {'S': json.dumps(reasoning)}
        }
    )

    return f"Item successfully written to {DYNAMODB_TABLE}"
