import React, { use } from "react";
import { RecommendationData } from "../types";
import RecommendationCard from "./RecommendationCard";
import { fetchCostOptimizationsRecommendation } from "@/services";

interface DashboardProps {
  recommendations: RecommendationData[];
}

const Dashboard: React.FC<DashboardProps> = () => {
  const recommendations = use(fetchCostOptimizationsRecommendation());

  console.log(recommendations);

  if (!recommendations) return <>Loading...</>;
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#232F3E] text-white">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Cloudsage - AWS Cost Optimizer
              </h1>
              <p className="text-blue-100 text-sm mt-1">
                Intelligent recommendations to optimize your cloud spend
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800">
            Active Recommendations
          </h2>
          <p className="text-gray-600 mt-1">
            Review and implement these recommendations to reduce costs and
            carbon footprint
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {recommendations.map((recommendation, index) => (
            <RecommendationCard key={index} data={recommendation} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
