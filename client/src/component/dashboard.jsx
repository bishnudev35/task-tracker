import React, { useState } from 'react';
import AllTask from './allTask';
import Profile from './profile';
import CreateTask from './creatTask';
import { UserCircleIcon, ListBulletIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

function DashboardPage() {
  const [activeSection, setActiveSection] = useState('profile');

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <Profile />;
      case 'allTasks':
        return <AllTask />;
      case 'manageTasks':
        return <CreateTask />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Enhanced Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 p-6 shadow-2xl">
        <div className="mb-10 pl-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Task Manager
          </h2>
          <p className="text-xs text-gray-400 mt-1">Productivity Dashboard</p>
        </div>
        
        <nav className="space-y-1">
          <button
            onClick={() => setActiveSection('profile')}
            className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 ${
              activeSection === 'profile'
                ? 'bg-gray-700 text-white shadow-inner'
                : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
            }`}
          >
            <UserCircleIcon className="w-6 h-6 mr-3 text-blue-400" />
            <span className="font-medium">Profile</span>
          </button>
          
          <button
            onClick={() => setActiveSection('allTasks')}
            className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 ${
              activeSection === 'allTasks'
                ? 'bg-gray-700 text-white shadow-inner'
                : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
            }`}
          >
            <ListBulletIcon className="w-6 h-6 mr-3 text-green-400" />
            <span className="font-medium">All Tasks</span>
          </button>
          
          <button
            onClick={() => setActiveSection('manageTasks')}
            className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 ${
              activeSection === 'manageTasks'
                ? 'bg-gray-700 text-white shadow-inner'
                : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
            }`}
          >
            <PlusCircleIcon className="w-6 h-6 mr-3 text-purple-400" />
            <span className="font-medium">Create Task</span>
          </button>
        </nav>
      </div>

      {/* Main content (unchanged) */}
      <div className="flex-1 p-8 bg-[#2f3547]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1c1d0d55] rounded-xl shadow-sm p-6">
           
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;