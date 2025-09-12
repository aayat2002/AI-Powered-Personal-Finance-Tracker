import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Budget, Category } from "../types";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget?: Budget | null;
  categories: Category[];
  onSave: (budget: Budget) => void;
}

const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  budget,
  categories,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    category: "",
    limit: "",
    period: "monthly" as "monthly" | "weekly" | "yearly",
  });

  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category,
        limit: budget.limit.toString(),
        period: budget.period,
      });
    } else {
      setFormData({
        category: "",
        limit: "",
        period: "monthly",
      });
    }
  }, [budget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category || !formData.limit) {
      alert("Please fill in all required fields");
      return;
    }

    const newBudget: Budget = {
      id: budget?.id || Date.now().toString(),
      category: formData.category,
      limit: parseFloat(formData.limit),
      spent: budget?.spent || 0,
      period: formData.period,
      startDate: budget?.startDate || new Date(),
      endDate:
        budget?.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };

    onSave(newBudget);
  };

  const expenseCategories = categories.filter((cat) => cat.type === "expense");

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
              {budget ? "Edit Budget" : "Add Budget"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                {expenseCategories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Limit *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.limit}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, limit: e.target.value }))
                  }
                  className="input pl-8 w-full"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Period */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Period
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, period: "weekly" }))
                  }
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    formData.period === "weekly"
                      ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
                      : "bg-gray-100 text-gray-700 border-2 border-transparent"
                  }`}
                >
                  Weekly
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, period: "monthly" }))
                  }
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    formData.period === "monthly"
                      ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
                      : "bg-gray-100 text-gray-700 border-2 border-transparent"
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, period: "yearly" }))
                  }
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    formData.period === "yearly"
                      ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
                      : "bg-gray-100 text-gray-700 border-2 border-transparent"
                  }`}
                >
                  Yearly
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
                {budget ? "Update" : "Add"} Budget
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BudgetModal;
