import { RecommendationData } from "../types";

export const mockRecommendation: RecommendationData = {
  recommendation: {
    action: "Resize",
    reason:
      "The current t2.micro instance is over-provisioned for the low CPU utilization observed.",
    suggested_instance_type: "t3.nano",
    estimated_savings_usd_per_day: 0.0038,
    percent_cost_savings: 25.33,
    estimated_co2_savings_grams_per_day: 4.75,
    percent_co2_savings: 25.33,
    aws_service_type: "EC2",
    region: "ap-south-1",
    start_time: "2025-05-15T11:16:12+00:00",
    synced_on: "2025-05-15T11:34:15.255008+00:00",
    uptime: "0:18:03.255008",
    instance_id: "i-09c091b52c1e61a97",
    current_instance_summary: [
      "vCPUs: 1",
      "RAM: 1 GiB",
      "Est. Cost/Day: $0.0120",
      "Est. Power/Day: 6.2 Wh",
    ],
    suggested_instance_summary: [
      "vCPUs: 1",
      "RAM: 1 GiB",
      "Est. Cost/Day: $0.0120",
      "Est. Power/Day: 6.2 Wh",
    ],
    current_instance_type: "t2.micro",
  },
  "instance-id": "i-09c091b52c1e61a97",
  reasoning: [
    "Based on the given CPU utilization data (2.24% for the last hour and 2.50% on average over 24 hours), the t2.micro instance is over-provisioned for the workload.",
    "The t3.nano instance is the next lower tier and would be sufficient to handle the observed CPU utilization while also reducing costs and carbon emissions.",
    "Stopping the instance is not recommended as the CPU utilization is above 5% and the uptime is less than 1 day, suggesting an active workload.",
    "To estimate energy consumption and CO₂ emissions, the following calculations were performed:",
    "t2.micro: 1 vCPU (Xen) ~ 2.5W, 1 GiB RAM ~ 0.5W, overhead ~ 1.5W. Total ~ 4.5W or 0.1080 kWh/day",
    "t3.nano: 2 vCPU (Nitro) ~ 2W, 0.5 GiB RAM ~ 0.25W, overhead ~ 1.5W. Total ~ 3.75W or 0.0900 kWh/day",
    "Using today's AWS on-demand pricing for ap-south-1 ($0.0115/hour for t2.micro and $0.0057/hour for t3.nano), the estimated daily cost savings are $0.0038 (25.33%).",
    "With a CO₂ emission factor of 500 grams/kWh, the estimated CO₂ savings are 4.75 grams/day (25.33%).",
  ],
};

// Create additional mock recommendations with variations for demonstration
export const mockRecommendations: RecommendationData[] = [
  mockRecommendation,
  {
    ...mockRecommendation,
    recommendation: {
      ...mockRecommendation.recommendation,
      action: "Stop",
      instance_id: "i-08d172c63d4a25f98",
      reason:
        "This instance has been idle for over 7 days with CPU utilization below 1%.",
      suggested_instance_type: "n/a",
      estimated_savings_usd_per_day: 0.0276,
      percent_cost_savings: 100,
      estimated_co2_savings_grams_per_day: 18.75,
      percent_co2_savings: 100,
    },
    "instance-id": "i-08d172c63d4a25f98",
    reasoning: [
      "Based on the CPU utilization data (0.12% for the last hour and 0.34% on average over 7 days), the instance appears to be idle.",
      "The instance has been running for 7 days with minimal activity, suggesting it's not being actively used.",
      "Stopping the instance would save 100% of its cost and carbon emissions until it's needed again.",
      "To estimate energy consumption and CO₂ emissions, the following calculations were performed:",
      "t2.micro: 1 vCPU (Xen) ~ 2.5W, 1 GiB RAM ~ 0.5W, overhead ~ 1.5W. Total ~ 4.5W or 0.1080 kWh/day",
      "Using today's AWS on-demand pricing for ap-south-1 ($0.0115/hour for t2.micro), the estimated daily cost savings are $0.0276 (100%).",
      "With a CO₂ emission factor of 500 grams/kWh, the estimated CO₂ savings are 18.75 grams/day (100%).",
    ],
  },
  {
    ...mockRecommendation,
    recommendation: {
      ...mockRecommendation.recommendation,
      action: "Resize",
      instance_id: "i-0af436c28d7f9e52b",
      reason:
        "This r5.xlarge instance is significantly over-provisioned for memory usage.",
      suggested_instance_type: "r5.large",
      estimated_savings_usd_per_day: 0.4224,
      percent_cost_savings: 50.0,
      estimated_co2_savings_grams_per_day: 62.8,
      percent_co2_savings: 50.0,
      aws_service_type: "EC2",
    },
    "instance-id": "i-0af436c28d7f9e52b",
    reasoning: [
      "Based on the memory utilization data (22.5% for the last 24 hours), the r5.xlarge instance (32 GiB memory) is significantly over-provisioned.",
      "An r5.large instance (16 GiB memory) would be sufficient to handle the observed memory utilization while cutting costs in half.",
      "CPU utilization is also low (8.2% average), and would still be comfortably handled by the smaller instance type.",
      "To estimate energy consumption and CO₂ emissions, calculations were performed based on AWS instance specifications.",
      "Using today's AWS on-demand pricing for ap-south-1 ($0.2112/hour for r5.xlarge and $0.1056/hour for r5.large), the estimated daily cost savings are $0.4224 (50%).",
      "The estimated CO₂ savings are 62.80 grams/day (50%).",
    ],
  },
];
