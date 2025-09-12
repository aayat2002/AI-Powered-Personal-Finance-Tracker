import { Transaction, Budget, DashboardStats } from "../types";

export const calculateDashboardStats = (
  transactions: Transaction[],
  budgets: Budget[],
  currentMonth: Date
): DashboardStats => {
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

  const monthlyTransactions = transactions.filter(
    (t) =>
      t.date instanceof Date &&
      t.date >= currentMonthStart &&
      t.date <= currentMonthEnd
  );

  const totalIncome = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netWorth = totalIncome - totalExpenses;

  const monthlyBudget = budgets
    .filter((b) => b.period === "monthly")
    .reduce((sum, b) => sum + b.limit, 0);

  const budgetUsed = budgets
    .filter((b) => b.period === "monthly")
    .reduce((sum, b) => sum + b.spent, 0);

  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  // Calculate top categories
  const categoryTotals = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return {
    totalIncome,
    totalExpenses,
    netWorth,
    monthlyBudget,
    budgetUsed,
    savingsRate,
    topCategories,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const getBudgetStatus = (
  budget: Budget
): "under" | "over" | "warning" => {
  const percentage = (budget.spent / budget.limit) * 100;
  if (percentage >= 100) return "over";
  if (percentage >= 80) return "warning";
  return "under";
};

export const generateAIInsights = (
  _transactions: Transaction[],
  budgets: Budget[],
  stats: DashboardStats
): string[] => {
  const insights: string[] = [];

  // Spending pattern insights
  if (stats.savingsRate < 0) {
    insights.push(
      "You're spending more than you earn this month. Consider reviewing your expenses."
    );
  } else if (stats.savingsRate < 10) {
    insights.push(
      "Your savings rate is low. Try to increase it to at least 20% for better financial health."
    );
  } else if (stats.savingsRate > 30) {
    insights.push(
      "Great job! You're saving over 30% of your income. Keep it up!"
    );
  }

  // Budget insights
  const overBudgetCategories = budgets.filter((b) => b.spent > b.limit);
  if (overBudgetCategories.length > 0) {
    insights.push(
      `You've exceeded budget in ${overBudgetCategories.length} category(ies).`
    );
  }

  // Category spending insights
  if (stats.topCategories.length > 0) {
    const topCategory = stats.topCategories[0];
    if (topCategory.percentage > 50) {
      insights.push(
        `${topCategory.category} accounts for over 50% of your expenses. Consider diversifying your spending.`
      );
    }
  }

  return insights;
};
