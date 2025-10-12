import { ReactNode } from 'react';
import { readUserSession } from '@/lib/actions';
import { redirect } from 'next/navigation';
import DistributorSidebar from './components/DistributorSidebar';
import DistributorHeader from './components/DistributorHeader';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: userSession } = await readUserSession();

  if (!userSession.session) {
    return redirect('/auth');
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <DistributorSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DistributorHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
