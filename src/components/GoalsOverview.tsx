import React from "react";
import { FinancialGoal } from "../types";
import { formatCurrency } from "../utils/calculations";

interface GoalsOverviewProps {
  goals: FinancialGoal[];
}

const GoalsOverview: React.FC<GoalsOverviewProps> = ({ goals }) => {
  const getPriorityColor = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-green-600 bg-green-50";
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-gray-300";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Financial Goals</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-2">🎯</div>
            <p className="text-gray-500 text-sm">No goals set up</p>
            <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
              Create your first goal
            </button>
          </div>
        ) : (
          goals.slice(0, 3).map((goal) => {
            const progressPercentage =
              (goal.currentAmount / goal.targetAmount) * 100;
            const isCompleted = progressPercentage >= 100;

            return (
              <div key={goal.id} className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {goal.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatCurrency(goal.currentAmount)} of{" "}
                      {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                      goal.priority
                    )}`}
                  >
                    {goal.priority}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                        progressPercentage
                      )}`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{progressPercentage.toFixed(0)}% complete</span>
                    <span
                      className={
                        isCompleted ? "text-green-600 font-medium" : ""
                      }
                    >
                      {isCompleted
                        ? "Completed!"
                        : `${formatCurrency(
                            goal.targetAmount - goal.currentAmount
                          )} to go`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GoalsOverview;
