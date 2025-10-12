'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function TestAuthPage() {
  const [authState, setAuthState] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This code only runs in the browser
    if (typeof window === 'undefined') return;

    async function testAuth() {
      try {
        const supabase = createClient();
        
        // Test 1: Check if client is initialized
        if (!supabase) {
          throw new Error('Supabase client not initialized');
        }

        // Test 2: Get current session
        const { data: session, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        // Test 3: Get user
        const { data: user, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        setAuthState({
          session: session.session,
          user: user.user,
          env: {
            url: process.env.NEXT_PUBLIC_SUPABASE_URL,
            key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
              ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10)}...` 
              : 'Not found',
            isBrowser: typeof window !== 'undefined'
          }
        });
      } catch (error) {
        console.error('Auth test failed:', error);
        setAuthState({ 
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          isBrowser: typeof window !== 'undefined'
        });
      } finally {
        setLoading(false);
      }
    }

    testAuth();
  }, []);

  if (loading) {
    return <div className="p-8">Testing authentication...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Authentication Test</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Environment</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
          {JSON.stringify(authState?.env || {}, null, 2)}
        </pre>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Session</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
          {JSON.stringify(authState?.session || 'No active session', null, 2)}
        </pre>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">User</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
          {JSON.stringify(authState?.user || 'No user data', null, 2)}
        </pre>
      </div>

      {authState?.error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <h2 className="text-lg font-semibold text-red-800">Error</h2>
          <p className="text-red-700">{authState.error}</p>
          {authState.stack && (
            <pre className="mt-2 text-xs text-red-600 overflow-x-auto">
              {authState.stack}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
