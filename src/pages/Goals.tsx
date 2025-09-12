import React, { useState } from "react";
import {
  Plus,
  Target,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
} from "lucide-react";
import { FinancialGoal } from "../types";
import { formatCurrency } from "../utils/calculations";
import GoalModal from "../components/GoalModal";

interface GoalsProps {
  goals: FinancialGoal[];
  setGoals: React.Dispatch<React.SetStateAction<FinancialGoal[]>>;
}

const Goals: React.FC<GoalsProps> = ({ goals, setGoals }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [filter, setFilter] = useState<
    "all" | "active" | "completed" | "paused"
  >("all");

  const filteredGoals = goals.filter((goal) => {
    if (filter === "all") return true;
    return goal.status === filter;
  });

  const handleAddGoal = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const handleEditGoal = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleDeleteGoal = (id: string) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      setGoals((prev) => prev.filter((g) => g.id !== id));
    }
  };

  const getPriorityColor = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-green-600 bg-green-50 border-green-200";
    }
  };

  const getStatusColor = (status: "active" | "completed" | "paused") => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "paused":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  const getStatusIcon = (status: "active" | "completed" | "paused") => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "paused":
        return <Clock className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getDaysRemaining = (targetDate: Date) => {
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-gray-300";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Goals</h1>
          <p className="mt-1 text-sm text-gray-600">
            Set and track your financial objectives
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddGoal}
            className="btn btn-primary px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Goal</span>
          </button>
        </div>
      </div>

      {/* Goal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Goals</p>
              <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {goals.filter((g) => g.status === "completed").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {goals.filter((g) => g.status === "active").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(
                  goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {(["all", "active", "completed", "paused"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === status
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {filteredGoals.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 text-4xl mb-2">🎯</div>
            <p className="text-gray-500 text-sm mb-4">
              {filter === "all" ? "No goals set up yet" : `No ${filter} goals`}
            </p>
            {filter === "all" && (
              <button
                onClick={handleAddGoal}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Create your first goal
              </button>
            )}
          </div>
        ) : (
          filteredGoals.map((goal) => {
            const progressPercentage =
              (goal.currentAmount / goal.targetAmount) * 100;
            const daysRemaining = getDaysRemaining(goal.targetDate);
            const isCompleted = progressPercentage >= 100;

            return (
              <div
                key={goal.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {goal.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                          goal.priority
                        )}`}
                      >
                        {goal.priority}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(
                          goal.status
                        )}`}
                      >
                        {getStatusIcon(goal.status)}
                        <span className="capitalize">{goal.status}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {formatCurrency(goal.currentAmount)} of{" "}
                      {formatCurrency(goal.targetAmount)}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {daysRemaining > 0
                            ? `${daysRemaining} days left`
                            : daysRemaining === 0
                            ? "Due today"
                            : `${Math.abs(daysRemaining)} days overdue`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-3 h-3" />
                        <span>{goal.category}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(
                        progressPercentage
                      )}`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {progressPercentage.toFixed(0)}% complete
                    </span>
                    <span
                      className={`font-medium ${
                        isCompleted ? "text-green-600" : "text-gray-900"
                      }`}
                    >
                      {isCompleted
                        ? "Completed!"
                        : `${formatCurrency(
                            goal.targetAmount - goal.currentAmount
                          )} to go`}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => handleEditGoal(goal)}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Goal Modal */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGoal(null);
        }}
        goal={editingGoal}
        onSave={(goal) => {
          if (editingGoal) {
            setGoals((prev) => prev.map((g) => (g.id === goal.id ? goal : g)));
          } else {
            setGoals((prev) => [...prev, goal]);
          }
          setIsModalOpen(false);
          setEditingGoal(null);
        }}
      />
    </div>
  );
};

export default Goals;
