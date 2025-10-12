'use client';

export default function TestEnvPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      <div className="space-y-4">
        <div>
          <h2 className="font-semibold">Supabase URL:</h2>
          <code className="bg-gray-100 p-2 rounded block overflow-x-auto">
            {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not found'}
          </code>
        </div>
        <div>
          <h2 className="font-semibold">Supabase Anon Key:</h2>
          <code className="bg-gray-100 p-2 rounded block overflow-x-auto">
            {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
              ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...` 
              : 'Not found'}
          </code>
        </div>
      </div>
    </div>
  );
}
