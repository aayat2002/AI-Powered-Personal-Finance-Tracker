import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Transaction, Category } from "../types";

interface SpendingChartProps {
  transactions: Transaction[];
  categories: Category[];
}

const SpendingChart: React.FC<SpendingChartProps> = ({
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
    const category = categories.find((c) => c.name === transaction.category);
    const existing = acc.find((item) => item.category === transaction.category);

    if (existing) {
      existing.amount += transaction.amount;
    } else {
      acc.push({
        category: transaction.category,
        amount: transaction.amount,
        color: category?.color || "#6b7280",
        icon: category?.icon || "💰",
      });
    }

    return acc;
  }, [] as Array<{ category: string; amount: number; color: string; icon: string }>);

  const data = categoryTotals.sort((a, b) => b.amount - a.amount).slice(0, 6); // Show top 6 categories

  const COLORS = data.map((item) => item.color);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{data.icon}</span>
            <div>
              <p className="font-medium text-gray-900">{data.category}</p>
              <p className="text-sm text-gray-600">
                ${data.amount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Spending by Category
        </h3>
        <div className="text-sm text-gray-500">Current Month</div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-2">📊</div>
          <p className="text-gray-500 text-sm">
            No spending data for this month
          </p>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="amount"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry) => (
                  <span style={{ color: entry.color, fontSize: "12px" }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default SpendingChart;
