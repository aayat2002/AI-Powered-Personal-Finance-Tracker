export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: Date;
  tags?: string[];
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: "monthly" | "weekly" | "yearly";
  startDate: Date;
  endDate: Date;
}

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  color: string;
  icon: string;
}

export interface AIInsight {
  id: string;
  type:
    | "spending_pattern"
    | "budget_alert"
    | "saving_opportunity"
    | "trend_analysis";
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  actionable: boolean;
  actionText?: string;
  createdAt: Date;
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  category: string;
  priority: "low" | "medium" | "high";
  status: "active" | "completed" | "paused";
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  netWorth: number;
  monthlyBudget: number;
  budgetUsed: number;
  savingsRate: number;
  topCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

export interface TimeRange {
  label: string;
  value: string;
  startDate: Date;
  endDate: Date;
}
