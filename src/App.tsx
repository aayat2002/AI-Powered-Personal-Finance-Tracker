import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import Insights from "./pages/Insights";
import { Transaction, Budget, FinancialGoal, Category } from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";

function App() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    "transactions",
    []
  );
  const [budgets, setBudgets] = useLocalStorage<Budget[]>("budgets", []);
  const [goals, setGoals] = useLocalStorage<FinancialGoal[]>("goals", []);
  const [categories] = useLocalStorage<Category[]>("categories", [
    {
      id: "1",
      name: "Food & Dining",
      type: "expense",
      color: "#ef4444",
      icon: "🍽️",
    },
    {
      id: "2",
      name: "Transportation",
      type: "expense",
      color: "#3b82f6",
      icon: "🚗",
    },
    {
      id: "3",
      name: "Shopping",
      type: "expense",
      color: "#8b5cf6",
      icon: "🛍️",
    },
    {
      id: "4",
      name: "Entertainment",
      type: "expense",
      color: "#f59e0b",
      icon: "🎬",
    },
    {
      id: "5",
      name: "Bills & Utilities",
      type: "expense",
      color: "#10b981",
      icon: "💡",
    },
    {
      id: "6",
      name: "Healthcare",
      type: "expense",
      color: "#f97316",
      icon: "🏥",
    },
    { id: "7", name: "Salary", type: "income", color: "#22c55e", icon: "💰" },
    {
      id: "8",
      name: "Freelance",
      type: "income",
      color: "#06b6d4",
      icon: "💼",
    },
    {
      id: "9",
      name: "Investment",
      type: "income",
      color: "#84cc16",
      icon: "📈",
    },
  ]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sample data for demonstration
  useEffect(() => {
    // Clear existing data to fix date serialization issues
    if (transactions.length > 0 && typeof transactions[0]?.date === "string") {
      localStorage.removeItem("transactions");
      localStorage.removeItem("budgets");
      localStorage.removeItem("goals");
      window.location.reload();
      return;
    }

    if (transactions.length === 0) {
      const sampleTransactions: Transaction[] = [
        {
          id: "1",
          type: "income",
          amount: 75000,
          category: "Salary",
          description: "Monthly salary",
          date: new Date(2024, 0, 1),
        },
        {
          id: "2",
          type: "expense",
          amount: 18000,
          category: "Food & Dining",
          description: "Grocery shopping",
          date: new Date(2024, 0, 2),
        },
        {
          id: "3",
          type: "expense",
          amount: 4500,
          category: "Transportation",
          description: "Gas and public transport",
          date: new Date(2024, 0, 3),
        },
        {
          id: "4",
          type: "expense",
          amount: 12000,
          category: "Bills & Utilities",
          description: "Electricity and water bill",
          date: new Date(2024, 0, 5),
        },
        {
          id: "5",
          type: "expense",
          amount: 2250,
          category: "Entertainment",
          description: "Movie tickets",
          date: new Date(2024, 0, 6),
        },
      ];
      setTransactions(sampleTransactions);
    }

    if (budgets.length === 0) {
      const sampleBudgets: Budget[] = [
        {
          id: "1",
          category: "Food & Dining",
          limit: 22500,
          spent: 18000,
          period: "monthly",
          startDate: new Date(2024, 0, 1),
          endDate: new Date(2024, 0, 31),
        },
        {
          id: "2",
          category: "Transportation",
          limit: 7500,
          spent: 4500,
          period: "monthly",
          startDate: new Date(2024, 0, 1),
          endDate: new Date(2024, 0, 31),
        },
        {
          id: "3",
          category: "Entertainment",
          limit: 4500,
          spent: 2250,
          period: "monthly",
          startDate: new Date(2024, 0, 1),
          endDate: new Date(2024, 0, 31),
        },
      ];
      setBudgets(sampleBudgets);
    }

    if (goals.length === 0) {
      const sampleGoals: FinancialGoal[] = [
        {
          id: "1",
          title: "Emergency Fund",
          targetAmount: 150000,
          currentAmount: 52500,
          targetDate: new Date(2024, 11, 31),
          category: "Savings",
          priority: "high",
          status: "active",
        },
        {
          id: "2",
          title: "Vacation Fund",
          targetAmount: 45000,
          currentAmount: 18000,
          targetDate: new Date(2024, 5, 30),
          category: "Travel",
          priority: "medium",
          status: "active",
        },
      ];
      setGoals(sampleGoals);
    }
  }, [
    transactions.length,
    budgets.length,
    goals.length,
    setTransactions,
    setBudgets,
    setGoals,
  ]);

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                AI Finance Tracker
              </h1>
              <div className="w-6"></div>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    transactions={transactions}
                    budgets={budgets}
                    goals={goals}
                    categories={categories}
                  />
                }
              />
              <Route
                path="/transactions"
                element={
                  <Transactions
                    transactions={transactions}
                    setTransactions={setTransactions}
                    categories={categories}
                  />
                }
              />
              <Route
                path="/budgets"
                element={
                  <Budgets
                    budgets={budgets}
                    setBudgets={setBudgets}
                    transactions={transactions}
                    categories={categories}
                  />
                }
              />
              <Route
                path="/goals"
                element={<Goals goals={goals} setGoals={setGoals} />}
              />
              <Route
                path="/insights"
                element={
                  <Insights
                    transactions={transactions}
                    budgets={budgets}
                    goals={goals}
                  />
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
