import React from "react";
import { Brain, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { Transaction, Budget, DashboardStats } from "../types";
import { generateAIInsights } from "../utils/calculations";

interface AIInsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
  stats: DashboardStats;
}

const AIInsights: React.FC<AIInsightsProps> = ({
  transactions,
  budgets,
  stats,
}) => {
  const insights = generateAIInsights(transactions, budgets, stats);

  const getInsightIcon = (insight: string) => {
    if (insight.includes("saving") || insight.includes("Great job")) {
      return <TrendingUp className="w-5 h-5 text-green-600" />;
    }
    if (insight.includes("exceeded") || insight.includes("spending more")) {
      return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
    return <Lightbulb className="w-5 h-5 text-blue-600" />;
  };

  const getInsightColor = (insight: string) => {
    if (insight.includes("saving") || insight.includes("Great job")) {
      return "border-green-200 bg-green-50";
    }
    if (insight.includes("exceeded") || insight.includes("spending more")) {
      return "border-red-200 bg-red-50";
    }
    return "border-blue-200 bg-blue-50";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
      </div>

      <div className="space-y-3">
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-2">🤖</div>
            <p className="text-gray-500 text-sm">No insights available yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Add more transactions to get personalized insights
            </p>
          </div>
        ) : (
          insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getInsightColor(insight)}`}
            >
              <div className="flex items-start space-x-3">
                {getInsightIcon(insight)}
                <p className="text-sm text-gray-700 leading-relaxed">
                  {insight}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {insights.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all insights →
          </button>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
