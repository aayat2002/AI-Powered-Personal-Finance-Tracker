import { Transaction, Budget, FinancialGoal, User } from "../types";
import { DashboardStats } from "../types";

export interface PersonalizedInsight {
  id: string;
  type: "spending" | "saving" | "budget" | "goal" | "trend" | "recommendation";
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  category: string;
  actionable: boolean;
  actionText?: string;
  impact: "positive" | "negative" | "neutral";
  confidence: number; // 0-100
  data?: any;
}

export const generatePersonalizedInsights = (
  user: User | null,
  transactions: Transaction[],
  budgets: Budget[],
  goals: FinancialGoal[],
  stats: DashboardStats
): PersonalizedInsight[] => {
  const insights: PersonalizedInsight[] = [];

  // Return empty insights if user is not available
  if (!user) {
    return insights;
  }

  // Get user's spending patterns
  const monthlyTransactions = transactions.filter((t) => {
    const now = new Date();
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getMonth() === now.getMonth() &&
      transactionDate.getFullYear() === now.getFullYear()
    );
  });

  const totalIncome = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // 1. Savings Rate Analysis
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  if (savingsRate < 10) {
    insights.push({
      id: "low-savings-rate",
      type: "saving",
      title: "Low Savings Rate Detected",
      description: `You're saving only ${savingsRate.toFixed(
        1
      )}% of your income. Financial experts recommend saving at least 20% for a healthy financial future.`,
      priority: "high",
      category: "Savings",
      actionable: true,
      actionText: "Review your expenses and set up automatic savings",
      impact: "negative",
      confidence: 95,
      data: { savingsRate, recommended: 20 },
    });
  } else if (savingsRate > 30) {
    insights.push({
      id: "excellent-savings-rate",
      type: "saving",
      title: "Excellent Savings Rate!",
      description: `You're saving ${savingsRate.toFixed(
        1
      )}% of your income. This is well above the recommended 20% and shows great financial discipline.`,
      priority: "low",
      category: "Savings",
      actionable: false,
      impact: "positive",
      confidence: 90,
      data: { savingsRate },
    });
  }

  // 2. Spending Category Analysis
  const categorySpending = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const topSpendingCategory = Object.entries(categorySpending).sort(
    ([, a], [, b]) => b - a
  )[0];

  if (topSpendingCategory && topSpendingCategory[1] > totalExpenses * 0.4) {
    insights.push({
      id: "high-category-spending",
      type: "spending",
      title: "High Spending in One Category",
      description: `${topSpendingCategory[0]} accounts for ${(
        (topSpendingCategory[1] / totalExpenses) *
        100
      ).toFixed(1)}% of your expenses. Consider diversifying your spending.`,
      priority: "medium",
      category: "Spending",
      actionable: true,
      actionText: "Review and reduce spending in this category",
      impact: "negative",
      confidence: 85,
      data: {
        category: topSpendingCategory[0],
        percentage: (topSpendingCategory[1] / totalExpenses) * 100,
      },
    });
  }

  // 3. Budget Analysis
  const overBudgetCategories = budgets.filter((b) => b.spent > b.limit);
  if (overBudgetCategories.length > 0) {
    insights.push({
      id: "budget-exceeded",
      type: "budget",
      title: "Budget Exceeded",
      description: `You've exceeded your budget in ${
        overBudgetCategories.length
      } category(ies): ${overBudgetCategories
        .map((b) => b.category)
        .join(", ")}.`,
      priority: "high",
      category: "Budget",
      actionable: true,
      actionText: "Review and adjust your spending or budget limits",
      impact: "negative",
      confidence: 100,
      data: { categories: overBudgetCategories.map((b) => b.category) },
    });
  }

  // 4. Goal Progress Analysis
  const activeGoals = goals.filter((g) => g.status === "active");
  const goalsBehind = activeGoals.filter((g) => {
    const now = new Date();
    const targetDate = new Date(g.targetDate);
    const timeRemaining = targetDate.getTime() - now.getTime();
    const daysRemaining = timeRemaining / (1000 * 60 * 60 * 24);
    const progressNeeded = (g.targetAmount - g.currentAmount) / g.targetAmount;
    const timeProgress = Math.max(0, (365 - daysRemaining) / 365);

    return progressNeeded > timeProgress + 0.1; // 10% buffer
  });

  if (goalsBehind.length > 0) {
    insights.push({
      id: "goals-behind-schedule",
      type: "goal",
      title: "Goals Behind Schedule",
      description: `${goalsBehind.length} of your financial goals are behind schedule. Consider increasing your monthly contributions.`,
      priority: "medium",
      category: "Goals",
      actionable: true,
      actionText: "Increase monthly contributions to your goals",
      impact: "negative",
      confidence: 80,
      data: { goals: goalsBehind.map((g) => g.title) },
    });
  }

  // 5. Spending Trend Analysis
  const last3Months = [];
  for (let i = 0; i < 3; i++) {
    const month = new Date();
    month.setMonth(month.getMonth() - i);
    const monthTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date);
      return (
        tDate.getMonth() === month.getMonth() &&
        tDate.getFullYear() === month.getFullYear() &&
        t.type === "expense"
      );
    });
    const monthTotal = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
    last3Months.push(monthTotal);
  }

  if (last3Months.length === 3) {
    const trend = last3Months[0] - last3Months[2]; // Current month - 2 months ago
    const trendPercentage = (trend / last3Months[2]) * 100;

    if (trendPercentage > 20) {
      insights.push({
        id: "spending-increase",
        type: "trend",
        title: "Spending Trend Alert",
        description: `Your spending has increased by ${trendPercentage.toFixed(
          1
        )}% over the last 3 months. This could impact your financial goals.`,
        priority: "medium",
        category: "Trends",
        actionable: true,
        actionText: "Review recent expenses and identify areas to cut back",
        impact: "negative",
        confidence: 75,
        data: { trendPercentage, months: last3Months },
      });
    } else if (trendPercentage < -15) {
      insights.push({
        id: "spending-decrease",
        type: "trend",
        title: "Great Spending Control!",
        description: `Your spending has decreased by ${Math.abs(
          trendPercentage
        ).toFixed(1)}% over the last 3 months. Keep up the good work!`,
        priority: "low",
        category: "Trends",
        actionable: false,
        impact: "positive",
        confidence: 80,
        data: { trendPercentage, months: last3Months },
      });
    }
  }

  // 6. Personalized Recommendations based on user data
  if (user?.preferences?.currency === "INR") {
    insights.push({
      id: "indian-financial-tips",
      type: "recommendation",
      title: "Indian Financial Tips",
      description:
        "Consider investing in Indian mutual funds or PPF for tax benefits. Also, explore NPS for retirement planning.",
      priority: "low",
      category: "Recommendations",
      actionable: true,
      actionText: "Research Indian investment options",
      impact: "positive",
      confidence: 70,
      data: { country: "India" },
    });
  }

  // 7. Emergency Fund Check
  const emergencyFundGoal = goals.find((g) =>
    g.title.toLowerCase().includes("emergency")
  );
  if (emergencyFundGoal) {
    const emergencyProgress =
      (emergencyFundGoal.currentAmount / emergencyFundGoal.targetAmount) * 100;
    if (emergencyProgress < 50) {
      insights.push({
        id: "emergency-fund-low",
        type: "recommendation",
        title: "Emergency Fund Priority",
        description: `Your emergency fund is only ${emergencyProgress.toFixed(
          1
        )}% complete. Aim for 3-6 months of expenses.`,
        priority: "high",
        category: "Emergency",
        actionable: true,
        actionText: "Increase emergency fund contributions",
        impact: "negative",
        confidence: 90,
        data: {
          progress: emergencyProgress,
          target: emergencyFundGoal.targetAmount,
        },
      });
    }
  }

  // Sort insights by priority and confidence
  return insights.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return b.confidence - a.confidence;
  });
};
