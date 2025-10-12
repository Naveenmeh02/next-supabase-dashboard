import React from "react";

export default function NewDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">New Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dashboard Cards */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Welcome to Your Dashboard</h3>
          <p className="text-gray-600 dark:text-gray-300">
            This is your new dashboard. You can add your content here.
          </p>
        </div>
        
        {/* Add more dashboard components here */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Quick Stats</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Now</p>
              <p className="text-2xl font-bold">42</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
