import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { FinancialGoal } from "../types";

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: FinancialGoal | null;
  onSave: (goal: FinancialGoal) => void;
}

const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  goal,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "",
    targetDate: "",
    category: "",
    priority: "medium" as "low" | "medium" | "high",
    status: "active" as "active" | "completed" | "paused",
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title,
        targetAmount: goal.targetAmount.toString(),
        currentAmount: goal.currentAmount.toString(),
        targetDate: goal.targetDate.toISOString().split("T")[0],
        category: goal.category,
        priority: goal.priority,
        status: goal.status,
      });
    } else {
      setFormData({
        title: "",
        targetAmount: "",
        currentAmount: "",
        targetDate: "",
        category: "",
        priority: "medium",
        status: "active",
      });
    }
  }, [goal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.targetAmount || !formData.category) {
      alert("Please fill in all required fields");
      return;
    }

    const newGoal: FinancialGoal = {
      id: goal?.id || Date.now().toString(),
      title: formData.title,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      targetDate: new Date(formData.targetDate),
      category: formData.category,
      priority: formData.priority,
      status: formData.status,
    };

    onSave(newGoal);
  };

  const categories = [
    "Emergency Fund",
    "Vacation",
    "Home Purchase",
    "Car Purchase",
    "Education",
    "Retirement",
    "Debt Payoff",
    "Investment",
    "Other",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />

        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {goal ? "Edit Goal" : "Add Goal"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goal Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="input w-full"
                placeholder="e.g., Emergency Fund"
                required
              />
            </div>

            {/* Target Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.targetAmount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      targetAmount: e.target.value,
                    }))
                  }
                  className="input pl-8 w-full"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Current Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.currentAmount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      currentAmount: e.target.value,
                    }))
                  }
                  className="input pl-8 w-full"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="input w-full"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Date
              </label>
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    targetDate: e.target.value,
                  }))
                }
                className="input w-full"
                required
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, priority: "low" }))
                  }
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    formData.priority === "low"
                      ? "bg-green-100 text-green-700 border-2 border-green-200"
                      : "bg-gray-100 text-gray-700 border-2 border-transparent"
                  }`}
                >
                  Low
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, priority: "medium" }))
                  }
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    formData.priority === "medium"
                      ? "bg-yellow-100 text-yellow-700 border-2 border-yellow-200"
                      : "bg-gray-100 text-gray-700 border-2 border-transparent"
                  }`}
                >
                  Medium
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, priority: "high" }))
                  }
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    formData.priority === "high"
                      ? "bg-red-100 text-red-700 border-2 border-red-200"
                      : "bg-gray-100 text-gray-700 border-2 border-transparent"
                  }`}
                >
                  High
                </button>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, status: "active" }))
                  }
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    formData.status === "active"
                      ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
                      : "bg-gray-100 text-gray-700 border-2 border-transparent"
                  }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, status: "paused" }))
                  }
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    formData.status === "paused"
                      ? "bg-yellow-100 text-yellow-700 border-2 border-yellow-200"
                      : "bg-gray-100 text-gray-700 border-2 border-transparent"
                  }`}
                >
                  Paused
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, status: "completed" }))
                  }
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    formData.status === "completed"
                      ? "bg-green-100 text-green-700 border-2 border-green-200"
                      : "bg-gray-100 text-gray-700 border-2 border-transparent"
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn btn-secondary py-2"
              >
                Cancel
              </button>
              <button type="submit" className="flex-1 btn btn-primary py-2">
                {goal ? "Update" : "Add"} Goal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GoalModal;
