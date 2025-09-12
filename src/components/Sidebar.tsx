import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  CreditCard,
  Target,
  TrendingUp,
  X,
  BarChart3,
  Wallet,
  PiggyBank,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Transactions", href: "/transactions", icon: CreditCard },
    { name: "Budgets", href: "/budgets", icon: Target },
    { name: "Goals", href: "/goals", icon: PiggyBank },
    { name: "Insights", href: "/insights", icon: TrendingUp },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FinanceAI</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <item.icon
                    className={`
                    mr-3 h-5 w-5 flex-shrink-0
                    ${
                      isActive
                        ? "text-blue-700"
                        : "text-gray-400 group-hover:text-gray-500"
                    }
                  `}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Quick Stats */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Wallet className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Quick Stats
              </span>
            </div>
            <div className="text-xs text-gray-600">
              <div className="flex justify-between">
                <span>This Month</span>
                <span className="font-medium">₹36,750</span>
              </div>
              <div className="flex justify-between">
                <span>Savings Rate</span>
                <span className="font-medium text-green-600">23%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
