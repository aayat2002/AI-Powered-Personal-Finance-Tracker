import React from "react";
import { Transaction, Category } from "../types";
import { formatCurrency } from "../utils/calculations";
import { format } from "date-fns";

interface RecentTransactionsProps {
  transactions: Transaction[];
  categories: Category[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Transactions
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-2">💳</div>
            <p className="text-gray-500 text-sm">No recent transactions</p>
          </div>
        ) : (
          transactions
            .filter((t) => t.date instanceof Date)
            .map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
                  style={{
                    backgroundColor: getCategoryColor(transaction.category),
                  }}
                >
                  {getCategoryIcon(transaction.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {transaction.category} •{" "}
                    {format(transaction.date, "MMM d, yyyy")}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
