'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
  username?: string;
  role?: string;
  createdAt?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    
    if (!userData) {
      router.push('/');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch {
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user.username || user.email}!
          </h2>
          <p className="text-indigo-100">
            You're successfully logged in to your whitelisted account.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Account Status</h3>
              <span className="text-2xl">✓</span>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">Active</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Whitelisted & Verified</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Access Level</h3>
              <span className="text-2xl">🔐</span>
            </div>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {user.role || 'Standard'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">User Privileges</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Member Since</h3>
              <span className="text-2xl">📅</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Registration Date</p>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Account Information</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Email</span>
              <span className="text-gray-900 dark:text-white">{user.email}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Username</span>
              <span className="text-gray-900 dark:text-white">{user.username || 'Not set'}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Role</span>
              <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                {user.role || 'Standard User'}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Whitelist Status</span>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                ✓ Approved
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Settings</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Manage your account preferences and settings</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Support</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Get help and contact support team</p>
          </div>
        </div>
      </main>
    </div>
  );
}
