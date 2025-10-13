'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LineChart, Users, Package, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import SignOut from './SignOut';


const navItems = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'Analytics', href: '/dashboard/analytics', icon: LineChart },
  { name: 'Retailers', href: '/dashboard/retailers', icon: Users },
  { name: 'Inventory', href: '/dashboard/inventory', icon: Package },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DistributorSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
        <div className="flex flex-col flex-grow overflow-y-auto">
          {/* Header */}
          <div className="flex items-center flex-shrink-0 px-6 py-6 border-b border-gray-200 dark:border-gray-800">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Distributor Hub</h1>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 px-4 py-6">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out',
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 border-2 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-900'
                        : 'text-gray-700 border-2 border-transparent hover:bg-gray-50 hover:text-gray-900 hover:border-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white dark:hover:border-gray-700'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'flex-shrink-0 h-5 w-5 transition-colors duration-300',
                        isActive
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          {/* Check Recommendation Section */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={() => window.location.href = "http://127.0.0.1:5500/app/test12.html"}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-indigo-200 dark:border-indigo-900 rounded-lg text-indigo-600 dark:text-indigo-400 text-sm font-medium bg-indigo-50 dark:bg-indigo-950/30 transition-all duration-300 ease-in-out hover:bg-indigo-100 hover:text-indigo-700 hover:border-indigo-300 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300 dark:hover:border-indigo-800"
            >
              Check Recommendation
            </button>
          </div>

          {/* Sign Out Section */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
            <SignOut className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-red-200 dark:border-red-900 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium bg-red-50 dark:bg-red-950/30 transition-all duration-300 ease-in-out hover:bg-red-100 hover:text-red-700 hover:border-red-300 dark:hover:bg-red-950/50 dark:hover:text-red-300 dark:hover:border-red-800" />
          </div>
        </div>
      </div>
    </div>
  );
}