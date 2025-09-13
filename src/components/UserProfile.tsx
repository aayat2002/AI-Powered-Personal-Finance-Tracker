import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { User, Settings, LogOut, Bell, Globe, DollarSign } from "lucide-react";

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <img
          src={
            user.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.name
            )}&background=3b82f6&color=fff`
          }
          alt={user.name}
          className="w-8 h-8 rounded-full"
        />
        <div className="text-left">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <img
                  src={
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name
                    )}&background=3b82f6&color=fff`
                  }
                  alt={user.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <div className="space-y-1">
                <div className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
                  <DollarSign className="w-4 h-4 mr-3" />
                  Currency: {user.preferences.currency}
                </div>
                <div className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
                  <Globe className="w-4 h-4 mr-3" />
                  Timezone: {user.preferences.timezone}
                </div>
                <div className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
                  <Bell className="w-4 h-4 mr-3" />
                  Notifications: {user.preferences.notifications ? "On" : "Off"}
                </div>
              </div>

              <div className="border-t border-gray-200 mt-2 pt-2">
                <button
                  onClick={() => {
                    // TODO: Open settings modal
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
