import React from "react";
import { Server, ArrowRight, Clock, Globe } from "lucide-react";
import { RecommendationData } from "../types";
import { formatDate } from "../utils/formatters";
import Metrics from "./Metrics";
import ReasoningSection from "./ReasoningSection";

interface RecommendationCardProps {
  data: RecommendationData;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ data }) => {
  const { recommendation } = data;

  const getActionBadgeColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "resize":
        return "bg-amber-100 text-amber-800";
      case "stop":
        return "bg-red-100 text-red-800";
      case "keep running":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span
                className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${getActionBadgeColor(
                  recommendation.action
                )}`}
              >
                {recommendation.action}
              </span>
              <span className="text-xs font-semibold rounded-full px-2.5 py-0.5 bg-gray-100 text-gray-800">
                {recommendation.aws_service_type}
              </span>
            </div>

            <h3 className="mt-2 text-lg font-semibold text-gray-900">
              {recommendation.reason}
            </h3>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <Server size={16} className="mr-2 text-gray-400" />
              <span className="font-mono">{recommendation.instance_id}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Globe size={16} className="mr-2 text-gray-400" />
              <span>{recommendation.region}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Clock size={16} className="mr-2 text-gray-400" />
              <span>Uptime: {recommendation.uptime}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
            <div className="flex-1">
              <p className="text-xs text-blue-700 font-medium">
                Current Instance
              </p>
              <p className="text-sm font-mono font-semibold text-blue-900">
                t2.micro
              </p>
            </div>

            <ArrowRight size={16} className="text-blue-500" />

            <div className="flex-1">
              <p className="text-xs text-green-700 font-medium">
                Suggested Instance
              </p>
              <p className="text-sm font-mono font-semibold text-green-900">
                {recommendation.suggested_instance_type}
              </p>
            </div>
          </div>
        </div>

        <Metrics
          costSavings={recommendation.estimated_savings_usd_per_day}
          costSavingsPercent={recommendation.percent_cost_savings}
          co2Savings={recommendation.estimated_co2_savings_grams_per_day}
          co2SavingsPercent={recommendation.percent_co2_savings}
        />

        <div className="mt-3 text-xs text-gray-500">
          Last updated: {formatDate(recommendation.synced_on)}
        </div>

        <ReasoningSection recommendationData={data} />
      </div>
    </div>
  );
};

export default RecommendationCard;
