'use client';

import { useSelector } from 'react-redux';
import { Bell, User, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TopBar() {
  const auth = useSelector(state => state.auth);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Left Side - Title */}
        <div className="hidden md:block">
          <h2 className="text-2xl font-bold text-primary">Dashboard</h2>
          <p className="text-sm text-gray-500">Welcome back, admin</p>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-6 ml-auto">
          {/* Time */}
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Clock className="w-4 h-4" />
            <span>{formattedTime}</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Admin Profile */}
          <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
              {auth.admin?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-dark">Admin</p>
              <p className="text-xs text-gray-500">{auth.admin?.email || 'admin@islamic-global.com'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
