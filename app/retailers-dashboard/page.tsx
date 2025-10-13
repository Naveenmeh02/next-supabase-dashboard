import { redirect } from "next/navigation";
import { readUserSession } from "@/lib/actions";

export default async function RetailersDashboardPage() {
  // const { data: userSession } = await readUserSession();


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Retailers Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Welcome to your retailer dashboard!
        </p>
      </div>
    </div>
  );
}
