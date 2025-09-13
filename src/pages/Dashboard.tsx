import React from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Plus,
} from "lucide-react";
import { Transaction, Budget, FinancialGoal, Category } from "../types";
import {
  calculateDashboardStats,
  formatCurrency,
  formatPercentage,
} from "../utils/calculations";
import StatsCard from "../components/StatsCard";
import RecentTransactions from "../components/RecentTransactions";
import BudgetOverview from "../components/BudgetOverview";
import GoalsOverview from "../components/GoalsOverview";
import SpendingChart from "../components/SpendingChart";
import AIInsights from "../components/AIInsights";

interface DashboardProps {
  transactions: Transaction[];
  budgets: Budget[];
  goals: FinancialGoal[];
  categories: Category[];
}

const Dashboard: React.FC<DashboardProps> = ({
  transactions,
  budgets,
  goals,
  categories,
}) => {
  // const [selectedPeriod] = useState("month");
  const currentDate = new Date();
  const stats = calculateDashboardStats(transactions, budgets, currentDate);

  const recentTransactions = transactions
    .filter((t) => t.date instanceof Date)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  const activeGoals = goals.filter((goal) => goal.status === "active");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back! Here's your financial overview.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn btn-primary px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Income"
          value={formatCurrency(stats.totalIncome)}
          change={12.5}
          changeType="positive"
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Total Expenses"
          value={formatCurrency(stats.totalExpenses)}
          change={-8.2}
          changeType="negative"
          icon={TrendingDown}
          color="red"
        />
        <StatsCard
          title="Net Worth"
          value={formatCurrency(stats.netWorth)}
          change={stats.savingsRate}
          changeType={stats.netWorth >= 0 ? "positive" : "negative"}
          icon={DollarSign}
          color={stats.netWorth >= 0 ? "green" : "red"}
        />
        <StatsCard
          title="Savings Rate"
          value={formatPercentage(stats.savingsRate)}
          change={5.2}
          changeType="positive"
          icon={Target}
          color="blue"
        />
      </div>

      {/* Charts and Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart transactions={transactions} categories={categories} />
        <BudgetOverview budgets={budgets} categories={categories} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentTransactions
          transactions={recentTransactions}
          categories={categories}
        />
        <GoalsOverview goals={activeGoals} />
        <AIInsights
          transactions={transactions}
          budgets={budgets}
          goals={goals}
        />
      </div>
    </div>
  );
};

export default Dashboard;
