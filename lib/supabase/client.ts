import { createBrowserClient } from '@supabase/ssr';

// This is a type-safe way to check if we're in the browser
const isBrowser = typeof window !== 'undefined';

export function createClient() {
  // Only log in browser to avoid build errors
  if (isBrowser) {
    console.log('Creating Supabase client with URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  }
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  // In a server component or during build, return a mock client
  if (!isBrowser) {
    return {
      auth: {
        signInWithPassword: () => Promise.resolve({ data: { session: null }, error: null }),
        signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      },
    } as any; // Type assertion to avoid type errors in components
  }

  // In the browser, return the real client
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  );
}
