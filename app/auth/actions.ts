'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

async function createServerSupabaseClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            console.error('Error setting cookie:', error);
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options, maxAge: 0 });
          } catch (error) {
            console.error('Error removing cookie:', error);
          }
        },
      },
    }
  );
}
interface LoginCredentials {
  email: string;
  password: string;
}

export async function loginWithEmailAndPassword(credentials: { email: string; password: string }) {
  console.log('Attempting login with email:', credentials.email);
  
  try {
    const supabase = await createServerSupabaseClient();
    
    // Verify client is properly initialized
    if (!supabase) {
      console.error('Supabase client not initialized');
      return { error: { message: 'Authentication service unavailable' } };
    }

    console.log('Calling signInWithPassword...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    console.log('Auth response:', { data, error });

    if (error) {
      console.error('Login error:', error);
      // Handle specific error cases
      if (error.message.includes('Invalid login credentials')) {
        return { error: { message: 'Invalid email or password' } };
      }
      // Remove email confirmation requirement
      if (error.message.includes('Email not confirmed')) {
        // Try to sign up the user if email is not confirmed
        console.log('Email not confirmed, attempting to resend confirmation or create account...');
        return await signUpWithEmailAndPassword(credentials);
      }
      return { error: { message: error.message || 'Login failed. Please try again.' } };
    }

    if (data.session) {
      console.log('Login successful, redirecting to dashboard');
      // Use a hard redirect to ensure cookies are set
      redirect('/dashboard');
    }

    // If no session but no error, try to get the session
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      redirect('/dashboard');
    }

    return { 
      error: { message: 'No active session after login. Please try again.' } 
    };
  } catch (error) {
    console.error('Unexpected error during login:', error);
    return { 
      error: { 
        message: error instanceof Error ? error.message : 'An unexpected error occurred' 
      } 
    };
  }
}

interface SignUpCredentials {
  email: string;
  password: string;
}

export async function signUpWithEmailAndPassword(credentials: { email: string; password: string }) {
  console.log('Attempting signup with email:', credentials.email);
  
  try {
    const supabase = await createServerSupabaseClient();
    
    if (!supabase) {
      console.error('Supabase client not initialized');
      return { error: { message: 'Authentication service unavailable' } };
    }

    // First, try to sign in (in case user already exists)
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    // If sign in is successful, redirect to dashboard
    if (signInData?.session) {
      console.log('Sign in successful, redirecting to dashboard');
      redirect('/dashboard');
    }

    // If user doesn't exist or password is wrong, try to sign up
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard`,
      },
    });

    if (signUpError) {
      console.error('Signup error:', signUpError);
      return { error: { message: signUpError.message || 'Signup failed. Please try again.' } };
    }

    // If we get here, signup was successful
    console.log('Signup successful, attempting to sign in...');
    
    // Try to sign in after successful signup
    const { data: newSignInData, error: newSignInError } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (newSignInError) {
      console.error('Auto sign-in after signup failed:', newSignInError);
      return { error: { message: 'Account created but automatic sign in failed. Please try to sign in manually.' } };
    }

    if (newSignInData.session) {
      console.log('Auto sign-in successful, redirecting to dashboard');
      redirect('/dashboard');
    }

    // If we get here, something unexpected happened
    console.error('Unexpected state after signup and sign in attempt');
    return { error: { message: 'Something went wrong. Please try to sign in manually.' } };
  } catch (error) {
    console.error('Unexpected error during signup:', error);
    return { 
      error: { 
        message: error instanceof Error ? error.message : 'An unexpected error occurred' 
      } 
    };
  }
}

export async function signOut() {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error; // Re-throw to handle in the client
  }
  
  // After successful sign out, redirect to auth page
  redirect('/auth');
}
