import React from "react";
import { TrendingDown, Leaf } from "lucide-react";
import {
  formatCurrency,
  formatPercentage,
  getSavingsColor,
} from "../utils/formatters";

interface MetricsProps {
  costSavings: number;
  costSavingsPercent: number;
  co2Savings: number;
  co2SavingsPercent: number;
}

const Metrics: React.FC<MetricsProps> = ({
  costSavings,
  costSavingsPercent,
  co2Savings,
  co2SavingsPercent,
}) => {
  const costColor = getSavingsColor(costSavingsPercent);
  const co2Color = getSavingsColor(co2SavingsPercent);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="flex items-center space-x-2 rounded-lg p-4 bg-white shadow-sm border border-gray-100">
        <div
          className={`p-2 rounded-full ${costColor
            .replace("text-", "bg-")
            .replace("bg-", "text-")} bg-opacity-10`}
        >
          <TrendingDown
            className={costColor.replace("bg-", "text-")}
            size={20}
          />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Estimated Daily Savings</p>
          <div className="flex items-baseline">
            <p className="text-gray-900 font-semibold">
              {formatCurrency(costSavings)}
            </p>
            <span
              className={`ml-2 text-xs font-medium rounded-full px-2 py-0.5 ${costColor}`}
            >
              {formatPercentage(costSavingsPercent)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 rounded-lg p-4 bg-white shadow-sm border border-gray-100">
        <div
          className={`p-2 rounded-full ${co2Color
            .replace("text-", "bg-")
            .replace("bg-", "text-")} bg-opacity-10`}
        >
          <Leaf className={co2Color.replace("bg-", "text-")} size={20} />
        </div>
        <div>
          <p className="text-gray-500 text-sm">CO₂ Reduction</p>
          <div className="flex items-baseline">
            <p className="text-gray-900 font-semibold">
              {co2Savings.toFixed(2)}g/day
            </p>
            <span
              className={`ml-2 text-xs font-medium rounded-full px-2 py-0.5 ${co2Color}`}
            >
              {formatPercentage(co2SavingsPercent)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
