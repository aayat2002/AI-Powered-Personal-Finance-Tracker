import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Transaction, Category } from "../types";
import { formatCurrency } from "../utils/calculations";

interface CategoryBreakdownProps {
  transactions: Transaction[];
  categories: Category[];
}

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  transactions,
  categories,
}) => {
  // Calculate spending by category for the current month
  const currentMonth = new Date();
  const currentMonthStart = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const currentMonthEnd = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );

  const monthlyExpenses = transactions.filter(
    (t) =>
      t.type === "expense" &&
      t.date >= currentMonthStart &&
      t.date <= currentMonthEnd
  );

  const categoryTotals = monthlyExpenses.reduce((acc, transaction) => {
    const existing = acc.find((item) => item.category === transaction.category);

    if (existing) {
      existing.amount += transaction.amount;
    } else {
      acc.push({
        category: transaction.category,
        amount: transaction.amount,
        color:
          categories.find((c) => c.name === transaction.category)?.color ||
          "#6b7280",
      });
    }

    return acc;
  }, [] as Array<{ category: string; amount: number; color: string }>);

  const chartData = categoryTotals
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8); // Show top 8 categories

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-1">{label}</p>
          <p className="text-sm text-gray-600">
            {formatCurrency(payload[0]?.value || 0)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Category Breakdown
        </h3>
        <div className="text-sm text-gray-500">Current Month</div>
      </div>

      {chartData.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-2">📊</div>
          <p className="text-gray-500 text-sm">
            No spending data for this month
          </p>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                type="number"
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <YAxis
                type="category"
                dataKey="category"
                stroke="#6b7280"
                fontSize={12}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default CategoryBreakdown;
