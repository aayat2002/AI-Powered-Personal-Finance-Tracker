import React from "react";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Target,
  DollarSign,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  generatePersonalizedInsights,
  PersonalizedInsight,
} from "../utils/personalizedInsights";
import { Transaction, Budget, FinancialGoal } from "../types";
import { calculateDashboardStats } from "../utils/calculations";

interface AIInsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
  goals: FinancialGoal[];
}

const AIInsights: React.FC<AIInsightsProps> = ({
  transactions,
  budgets,
  goals,
}) => {
  const { user } = useAuth();
  const currentDate = new Date();
  const stats = calculateDashboardStats(transactions, budgets, currentDate);
  const insights = generatePersonalizedInsights(
    user,
    transactions,
    budgets,
    goals,
    stats
  );

  const getInsightIcon = (insight: PersonalizedInsight) => {
    switch (insight.type) {
      case "saving":
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case "spending":
        return <DollarSign className="w-5 h-5 text-red-600" />;
      case "budget":
        return <Target className="w-5 h-5 text-orange-600" />;
      case "goal":
        return <Target className="w-5 h-5 text-purple-600" />;
      case "trend":
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case "recommendation":
        return <Lightbulb className="w-5 h-5 text-yellow-600" />;
      default:
        return <Lightbulb className="w-5 h-5 text-blue-600" />;
    }
  };

  const getInsightColor = (insight: PersonalizedInsight) => {
    if (insight.impact === "positive") {
      return "border-green-200 bg-green-50";
    }
    if (insight.impact === "negative") {
      return "border-red-200 bg-red-50";
    }
    return "border-blue-200 bg-blue-50";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
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
          insights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border ${getInsightColor(insight)}`}
            >
              <div className="flex items-start space-x-3">
                {getInsightIcon(insight)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      {insight.title}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        insight.priority
                      )}`}
                    >
                      {insight.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">
                    {insight.description}
                  </p>
                  {insight.actionable && insight.actionText && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-600 font-medium">
                        💡 {insight.actionText}
                      </span>
                      <span className="text-xs text-gray-500">
                        {insight.confidence}% confidence
                      </span>
                    </div>
                  )}
                </div>
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
