import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Transaction, Budget } from "../types";
import { formatCurrency } from "../utils/calculations";
import { format, subMonths } from "date-fns";

interface MonthlyComparisonProps {
  transactions: Transaction[];
  budgets: Budget[];
}

const MonthlyComparison: React.FC<MonthlyComparisonProps> = ({
  transactions,
  budgets,
}) => {
  // Get last 6 months of data
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i);
    return {
      month: format(date, "MMM yyyy"),
      monthStart: new Date(date.getFullYear(), date.getMonth(), 1),
      monthEnd: new Date(date.getFullYear(), date.getMonth() + 1, 0),
    };
  });

  const chartData = months.map(({ month, monthStart, monthEnd }) => {
    const monthlyTransactions = transactions.filter(
      (t) => t.date >= monthStart && t.date <= monthEnd
    );

    const income = monthlyTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const budget = budgets
      .filter((b) => b.period === "monthly")
      .reduce((sum, b) => sum + b.limit, 0);

    return {
      month,
      income,
      expenses,
      budget,
      net: income - expenses,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-green-600">
              Income:{" "}
              {formatCurrency(
                payload.find((p: any) => p.dataKey === "income")?.value || 0
              )}
            </p>
            <p className="text-sm text-red-600">
              Expenses:{" "}
              {formatCurrency(
                payload.find((p: any) => p.dataKey === "expenses")?.value || 0
              )}
            </p>
            <p className="text-sm text-blue-600">
              Budget:{" "}
              {formatCurrency(
                payload.find((p: any) => p.dataKey === "budget")?.value || 0
              )}
            </p>
            <p className="text-sm font-medium text-gray-900">
              Net:{" "}
              {formatCurrency(
                payload.find((p: any) => p.dataKey === "net")?.value || 0
              )}
            </p>
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
          Monthly Comparison
        </h3>
        <div className="text-sm text-gray-500">Last 6 months</div>
      </div>

      {chartData.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-2">📊</div>
          <p className="text-gray-500 text-sm">No data available</p>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="income"
                fill="#22c55e"
                name="Income"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="expenses"
                fill="#ef4444"
                name="Expenses"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="budget"
                fill="#3b82f6"
                name="Budget"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default MonthlyComparison;
