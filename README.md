# AI-Powered Personal Finance Tracker

A modern, responsive personal finance management application built with React, TypeScript, and Tailwind CSS. Features AI-powered insights, comprehensive budgeting tools, and beautiful data visualizations.

## ✨ Features

### 🏠 Dashboard

- **Real-time Financial Overview**: Track income, expenses, net worth, and savings rate
- **Interactive Charts**: Visualize spending patterns with pie charts and trend graphs
- **Quick Stats**: Monitor your financial health at a glance
- **Recent Transactions**: View your latest financial activity

### 💳 Transaction Management

- **Add/Edit/Delete Transactions**: Full CRUD operations for income and expenses
- **Category Management**: Organize transactions with customizable categories
- **Search & Filter**: Find transactions quickly with advanced filtering
- **Date Tracking**: Monitor when transactions occurred

### 🎯 Budget Management

- **Set Budget Limits**: Create monthly, weekly, or yearly budgets
- **Visual Progress Tracking**: See how much you've spent vs. your limits
- **Budget Alerts**: Get notified when approaching or exceeding budgets
- **Category-based Budgets**: Set different limits for different spending categories

### 🎯 Financial Goals

- **Goal Setting**: Create and track financial objectives
- **Progress Monitoring**: Visual progress bars and completion percentages
- **Priority Levels**: Set high, medium, or low priority goals
- **Status Tracking**: Mark goals as active, paused, or completed

### 🤖 AI-Powered Insights

- **Smart Recommendations**: Get personalized financial advice
- **Spending Pattern Analysis**: Understand your spending habits
- **Budget Alerts**: AI-powered warnings about budget overruns
- **Savings Opportunities**: Discover ways to save more money

### 📊 Data Visualization

- **Spending Trends**: Line charts showing income vs. expenses over time
- **Category Breakdown**: Bar charts displaying spending by category
- **Monthly Comparisons**: Compare your financial performance across months
- **Interactive Charts**: Built with Recharts for smooth interactions

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ai-finance-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **State Management**: React Hooks with Local Storage

## 📱 Features Overview

### Modern UI/UX

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme**: Clean, modern interface with excellent contrast
- **Smooth Animations**: Subtle transitions and hover effects
- **Intuitive Navigation**: Easy-to-use sidebar navigation

### Data Persistence

- **Local Storage**: All data is saved locally in your browser
- **No Backend Required**: Works entirely in the frontend
- **Data Export**: Export your financial data for backup

### AI Insights Engine

- **Spending Analysis**: Identifies unusual spending patterns
- **Budget Recommendations**: Suggests optimal budget allocations
- **Savings Tips**: Provides actionable advice for saving money
- **Trend Predictions**: Forecasts future spending based on current patterns

## 🎨 Customization

### Adding New Categories

1. Navigate to the transactions page
2. Add a new transaction
3. Create a new category when prompted
4. The category will be available for future transactions

### Modifying Budgets

1. Go to the Budgets page
2. Click "Add Budget" or edit existing budgets
3. Set your desired limits and periods
4. Monitor progress in real-time

### Setting Financial Goals

1. Visit the Goals page
2. Click "Add Goal"
3. Set your target amount and deadline
4. Track progress as you save money

## 📊 Sample Data

The application comes with sample data to help you get started:

- Sample transactions across different categories
- Pre-configured budgets for common expenses
- Example financial goals
- AI insights based on the sample data

## 🔧 Development

### Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── main.tsx           # Application entry point
```

### Key Components

- **Dashboard**: Main overview page with stats and charts
- **Transactions**: Transaction management interface
- **Budgets**: Budget creation and monitoring
- **Goals**: Financial goal tracking
- **Insights**: AI-powered recommendations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Recharts** for beautiful data visualizations
- **Tailwind CSS** for rapid UI development
- **Lucide React** for consistent iconography
- **React** and **TypeScript** for a robust development experience

## 📞 Support

If you encounter any issues or have questions:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

---

**Happy Financial Tracking! 💰📈**
