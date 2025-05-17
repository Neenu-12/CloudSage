export interface Recommendation {
  action: string;
  reason: string;
  suggested_instance_type: string;
  estimated_savings_usd_per_day: number;
  percent_cost_savings: number;
  estimated_co2_savings_grams_per_day: number;
  percent_co2_savings: number;
  aws_service_type: string;
  region: string;
  start_time: string;
  synced_on: string;
  uptime: string;
  instance_id: string;
  current_instance_summary: string[];
  suggested_instance_summary: string[];
  current_instance_type: string;
}

export interface RecommendationData {
  recommendation: Recommendation;
  "instance-id": string;
  reasoning: string[];
}
