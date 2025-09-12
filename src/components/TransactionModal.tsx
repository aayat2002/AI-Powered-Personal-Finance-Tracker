import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Transaction, Category } from "../types";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
  categories: Category[];
  onSave: (transaction: Transaction) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  transaction,
  categories,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        category: transaction.category,
        description: transaction.description,
        date:
          transaction.date instanceof Date
            ? transaction.date.toISOString().split("T")[0]
            : new Date(transaction.date).toISOString().split("T")[0],
      });
    } else {
      setFormData({
        type: "expense",
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.category || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }

    const newTransaction: Transaction = {
      id: transaction?.id || Date.now().toString(),
      type: formData.type,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: new Date(formData.date),
    };

    onSave(newTransaction);
  };

  const filteredCategories = categories.filter(
    (cat) => cat.type === formData.type
  );

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
              {transaction ? "Edit Transaction" : "Add Transaction"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, type: "expense" }))
                  }
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    formData.type === "expense"
                      ? "bg-red-100 text-red-700 border-2 border-red-200"
                      : "bg-gray-100 text-gray-700 border-2 border-transparent"
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, type: "income" }))
                  }
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    formData.type === "income"
                      ? "bg-green-100 text-green-700 border-2 border-green-200"
                      : "bg-gray-100 text-gray-700 border-2 border-transparent"
                  }`}
                >
                  Income
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  className="input pl-8 w-full"
                  placeholder="0.00"
                  required
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
                {filteredCategories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="input w-full"
                placeholder="Enter description"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                className="input w-full"
                required
              />
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
                {transaction ? "Update" : "Add"} Transaction
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
