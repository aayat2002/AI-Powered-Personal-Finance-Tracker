import React from "react";
import { Budget, Category } from "../types";
import { formatCurrency, getBudgetStatus } from "../utils/calculations";

interface BudgetOverviewProps {
  budgets: Budget[];
  categories: Category[];
}

const BudgetOverview: React.FC<BudgetOverviewProps> = ({
  budgets,
  categories,
}) => {
  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName);
    return category?.icon || "💰";
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName);
    return category?.color || "#6b7280";
  };

  const getStatusColor = (status: "under" | "over" | "warning") => {
    switch (status) {
      case "over":
        return "text-red-600 bg-red-50";
      case "warning":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-green-600 bg-green-50";
    }
  };

  const getStatusText = (status: "under" | "over" | "warning") => {
    switch (status) {
      case "over":
        return "Over Budget";
      case "warning":
        return "Near Limit";
      default:
        return "On Track";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Budget Overview</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Manage
        </button>
      </div>

      <div className="space-y-4">
        {budgets.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-2">🎯</div>
            <p className="text-gray-500 text-sm">No budgets set up</p>
            <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
              Create your first budget
            </button>
          </div>
        ) : (
          budgets.slice(0, 4).map((budget) => {
            const status = getBudgetStatus(budget);
            const percentage = (budget.spent / budget.limit) * 100;

            return (
              <div key={budget.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                      style={{
                        backgroundColor: getCategoryColor(budget.category),
                      }}
                    >
                      {getCategoryIcon(budget.category)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {budget.category}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(budget.spent)} of{" "}
                        {formatCurrency(budget.limit)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      status
                    )}`}
                  >
                    {getStatusText(status)}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      status === "over"
                        ? "bg-red-500"
                        : status === "warning"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-500">
                  <span>{percentage.toFixed(0)}% used</span>
                  <span>
                    {formatCurrency(budget.limit - budget.spent)} remaining
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BudgetOverview;
