import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Transaction } from "../types";
import { formatCurrency } from "../utils/calculations";
import { format, subDays, subMonths } from "date-fns";

interface SpendingTrendChartProps {
  transactions: Transaction[];
  selectedPeriod: string;
}

const SpendingTrendChart: React.FC<SpendingTrendChartProps> = ({
  transactions,
  selectedPeriod,
}) => {
  const getDateRange = () => {
    const now = new Date();
    switch (selectedPeriod) {
      case "week":
        return { start: subDays(now, 7), end: now };
      case "month":
        return { start: subDays(now, 30), end: now };
      case "quarter":
        return { start: subMonths(now, 3), end: now };
      case "year":
        return { start: subDays(now, 365), end: now };
      default:
        return { start: subDays(now, 30), end: now };
    }
  };

  const { start, end } = getDateRange();

  // Group transactions by day
  const dailyData = transactions
    .filter((t) => t.date >= start && t.date <= end)
    .reduce((acc, transaction) => {
      const dateKey = format(transaction.date, "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey, income: 0, expenses: 0, net: 0 };
      }

      if (transaction.type === "income") {
        acc[dateKey].income += transaction.amount;
      } else {
        acc[dateKey].expenses += transaction.amount;
      }

      acc[dateKey].net = acc[dateKey].income - acc[dateKey].expenses;
      return acc;
    }, {} as Record<string, { date: string; income: number; expenses: number; net: number }>);

  const chartData = Object.values(dailyData).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">
            {format(new Date(label), "MMM d, yyyy")}
          </p>
          <div className="space-y-1">
            <p className="text-sm text-green-600">
              Income: {formatCurrency(payload[0]?.value || 0)}
            </p>
            <p className="text-sm text-red-600">
              Expenses: {formatCurrency(payload[1]?.value || 0)}
            </p>
            <p className="text-sm font-medium text-gray-900">
              Net: {formatCurrency(payload[2]?.value || 0)}
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
        <h3 className="text-lg font-semibold text-gray-900">Spending Trend</h3>
        <div className="text-sm text-gray-500 capitalize">
          {selectedPeriod} view
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-2">📈</div>
          <p className="text-gray-500 text-sm">No data for this period</p>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => format(new Date(value), "MMM d")}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                name="Expenses"
              />
              <Line
                type="monotone"
                dataKey="net"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                name="Net"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default SpendingTrendChart;
