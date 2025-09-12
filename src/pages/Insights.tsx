import React, { useState } from "react";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Calendar,
} from "lucide-react";
import { Transaction, Budget, FinancialGoal } from "../types";
import {
  calculateDashboardStats,
  generateAIInsights,
} from "../utils/calculations";
import { formatCurrency, formatPercentage } from "../utils/calculations";
import SpendingTrendChart from "../components/SpendingTrendChart";
import CategoryBreakdown from "../components/CategoryBreakdown";
import MonthlyComparison from "../components/MonthlyComparison";

interface InsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
  goals: FinancialGoal[];
}

const Insights: React.FC<InsightsProps> = ({
  transactions,
  budgets,
  goals,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const currentDate = new Date();
  const stats = calculateDashboardStats(transactions, budgets, currentDate);
  const aiInsights = generateAIInsights(transactions, budgets, stats);

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

  const getInsightSeverity = (insight: string): "low" | "medium" | "high" => {
    if (insight.includes("exceeded") || insight.includes("spending more")) {
      return "high";
    }
    if (
      insight.includes("savings rate is low") ||
      insight.includes("over 50%")
    ) {
      return "medium";
    }
    return "low";
  };

  const getSeverityColor = (severity: "low" | "medium" | "high") => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-green-600 bg-green-100";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
          <p className="mt-1 text-sm text-gray-600">
            Personalized financial insights powered by AI
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input w-32"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">AI Insights</p>
              <p className="text-2xl font-bold text-gray-900">
                {aiInsights.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Savings Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(stats.savingsRate)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Over Budget</p>
              <p className="text-2xl font-bold text-gray-900">
                {budgets.filter((b) => b.spent > b.limit).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Top Category</p>
              <p className="text-lg font-bold text-gray-900">
                {stats.topCategories[0]?.category || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            AI-Powered Insights
          </h3>
        </div>

        <div className="space-y-4">
          {aiInsights.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-2">🤖</div>
              <p className="text-gray-500 text-sm">No insights available yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Add more transactions to get personalized insights
              </p>
            </div>
          ) : (
            aiInsights.map((insight, index) => {
              const severity = getInsightSeverity(insight);
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getInsightColor(
                    insight
                  )}`}
                >
                  <div className="flex items-start space-x-3">
                    {getInsightIcon(insight)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                            severity
                          )}`}
                        >
                          {severity.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {insight}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingTrendChart
          transactions={transactions}
          selectedPeriod={selectedPeriod}
        />
        <CategoryBreakdown transactions={transactions} categories={[]} />
      </div>

      {/* Monthly Comparison */}
      <MonthlyComparison transactions={transactions} budgets={budgets} />

      {/* Goals Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Goals Progress
          </h3>
        </div>

        <div className="space-y-4">
          {goals.filter((g) => g.status === "active").length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-2">🎯</div>
              <p className="text-gray-500 text-sm">No active goals</p>
            </div>
          ) : (
            goals
              .filter((g) => g.status === "active")
              .map((goal) => {
                const progressPercentage =
                  (goal.currentAmount / goal.targetAmount) * 100;
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium text-gray-900">
                        {goal.title}
                      </h4>
                      <span className="text-sm text-gray-600">
                        {formatCurrency(goal.currentAmount)} /{" "}
                        {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(progressPercentage, 100)}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{progressPercentage.toFixed(0)}% complete</span>
                      <span>
                        {goal.currentAmount >= goal.targetAmount
                          ? "Completed!"
                          : `${formatCurrency(
                              goal.targetAmount - goal.currentAmount
                            )} to go`}
                      </span>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
};

export default Insights;
