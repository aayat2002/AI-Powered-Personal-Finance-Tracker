import React, { useState } from "react";
import { Plus, Target, AlertTriangle, CheckCircle } from "lucide-react";
import { Budget, Category, Transaction } from "../types";
import { formatCurrency, getBudgetStatus } from "../utils/calculations";
import BudgetModal from "../components/BudgetModal";

interface BudgetsProps {
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  transactions: Transaction[];
  categories: Category[];
}

const Budgets: React.FC<BudgetsProps> = ({
  budgets,
  setBudgets,
  transactions: _transactions,
  categories,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const handleAddBudget = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleDeleteBudget = (id: string) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      setBudgets((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName);
    return category?.icon || "💰";
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName);
    return category?.color || "#6b7280";
  };

  const getStatusIcon = (status: "under" | "over" | "warning") => {
    switch (status) {
      case "over":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
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

  const getStatusColor = (status: "under" | "over" | "warning") => {
    switch (status) {
      case "over":
        return "border-red-200 bg-red-50";
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      default:
        return "border-green-200 bg-green-50";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track your spending against budget limits
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddBudget}
            className="btn btn-primary px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Budget</span>
          </button>
        </div>
      </div>

      {/* Budget Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budgets</p>
              <p className="text-2xl font-bold text-gray-900">
                {budgets.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">On Track</p>
              <p className="text-2xl font-bold text-gray-900">
                {budgets.filter((b) => getBudgetStatus(b) === "under").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Over Budget</p>
              <p className="text-2xl font-bold text-gray-900">
                {budgets.filter((b) => getBudgetStatus(b) === "over").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Budgets List */}
      <div className="space-y-4">
        {budgets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 text-4xl mb-2">🎯</div>
            <p className="text-gray-500 text-sm mb-4">No budgets set up yet</p>
            <button
              onClick={handleAddBudget}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Create your first budget
            </button>
          </div>
        ) : (
          budgets.map((budget) => {
            const status = getBudgetStatus(budget);
            const percentage = (budget.spent / budget.limit) * 100;

            return (
              <div
                key={budget.id}
                className={`bg-white rounded-xl shadow-sm border p-6 ${getStatusColor(
                  status
                )}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg"
                      style={{
                        backgroundColor: getCategoryColor(budget.category),
                      }}
                    >
                      {getCategoryIcon(budget.category)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {budget.category}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {budget.period.charAt(0).toUpperCase() +
                          budget.period.slice(1)}{" "}
                        budget
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-600">Spent</p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(budget.spent)} /{" "}
                        {formatCurrency(budget.limit)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(status)}
                      <span className="text-sm font-medium">
                        {getStatusText(status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        status === "over"
                          ? "bg-red-500"
                          : status === "warning"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>{percentage.toFixed(0)}% used</span>
                    <span>
                      {budget.spent > budget.limit
                        ? `${formatCurrency(budget.spent - budget.limit)} over`
                        : `${formatCurrency(
                            budget.limit - budget.spent
                          )} remaining`}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => handleEditBudget(budget)}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBudget(budget.id)}
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

      {/* Budget Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
        }}
        budget={editingBudget}
        categories={categories}
        onSave={(budget) => {
          if (editingBudget) {
            setBudgets((prev) =>
              prev.map((b) => (b.id === budget.id ? budget : b))
            );
          } else {
            setBudgets((prev) => [...prev, budget]);
          }
          setIsModalOpen(false);
          setEditingBudget(null);
        }}
      />
    </div>
  );
};

export default Budgets;
