"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Server } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./Cards";
import { RecommendationData } from "@/types";

interface ReasoningSectionProps {
  recommendationData: RecommendationData;
}

const ReasoningSection: React.FC<ReasoningSectionProps> = ({
  recommendationData,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    reasoning,
    recommendation: {
      suggested_instance_type: suggestedInstanceType,
      current_instance_type: currentInstanceType,
      suggested_instance_summary: suggestedInstanceSummary,
      current_instance_summary: currentInstanceSummary,
    },
  } = recommendationData;

  return (
    <div className="mt-4 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex justify-between items-center w-full p-4 text-left text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <span className="font-medium">Detailed Reasoning</span>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="p-4 space-y-2 list-disc px-8">
          {reasoning.map((reason, index) => (
            <li key={index} className="text-gray-700 text-sm">
              {reason}
            </li>
          ))}
        </ul>

        <div className="bg-white p-2">
          <Card>
            <CardHeader>
              <CardTitle>Instance Comparison</CardTitle>
              <CardDescription>
                Current vs. Recommended Instance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Server className="h-5 w-5 text-blue-500" />
                    <h3 className="font-medium">
                      Current: {currentInstanceType}
                    </h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-500 list-disc px-5">
                    {currentInstanceSummary.map((suggestion, index) => (
                      <li key={suggestion + index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
                <div className="border rounded-lg p-4 border-green-200 bg-green-50">
                  <div className="flex items-center gap-2 mb-3">
                    <Server className="h-5 w-5 text-green-500" />
                    <h3 className="font-medium">
                      Recommended: {suggestedInstanceType}
                    </h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-500 list-disc px-5">
                    {suggestedInstanceSummary.map((suggestion, index) => (
                      <li key={suggestion + index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReasoningSection;
