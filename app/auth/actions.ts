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
  // Trim email and password to avoid whitespace issues
  const email = credentials.email.trim().toLowerCase();
  const password = credentials.password.trim();
  
  console.log('Attempting login with email:', email);
  
  try {
    const supabase = await createServerSupabaseClient();
    
    // Verify client is properly initialized
    if (!supabase) {
      console.error('Supabase client not initialized');
      return { error: { message: 'Authentication service unavailable' } };
    }

    console.log('Calling signInWithPassword...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('Auth response:', { data, error });

    if (error) {
      console.error('Login error:', error);
      // Handle specific error cases
      if (error.message.includes('Invalid login credentials')) {
        return { error: { message: 'Invalid email or password. Please check your credentials and try again.' } };
      }
      if (error.message.includes('Email not confirmed')) {
        return { error: { message: 'Please confirm your email address before logging in.' } };
      }
      if (error.message.includes('User not found')) {
        return { error: { message: 'No account found with this email. Please sign up first.' } };
      }
      return { error: { message: error.message || 'Login failed. Please try again.' } };
    }

    if (data.session && data.user) {
      console.log('Login successful, checking user role');
      
      // Check if user has retailer role in metadata
      const userRole = data.user.user_metadata?.role;
      
      if (userRole === 'retailer') {
        console.log('Retailer user, redirecting to retailers-dashboard');
        redirect('/retailers-dashboard');
      } else {
        console.log('Non-retailer user, redirecting to dashboard');
        redirect('/dashboard');
      }
    }

    // If no session but no error, try to get the session
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const userRole = session.user.user_metadata?.role;
      if (userRole === 'retailer') {
        redirect('/retailers-dashboard');
      } else {
        redirect('/dashboard');
      }
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
  // Trim email and password to avoid whitespace issues
  const email = credentials.email.trim().toLowerCase();
  const password = credentials.password.trim();
  
  console.log('Attempting signup with email:', email);
  
  try {
    const supabase = await createServerSupabaseClient();
    
    if (!supabase) {
      console.error('Supabase client not initialized');
      return { error: { message: 'Authentication service unavailable' } };
    }

    // First, try to sign in (in case user already exists)
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // If sign in is successful, redirect based on role
    if (signInData?.session && signInData.user) {
      console.log('User already exists, signing in');
      const userRole = signInData.user.user_metadata?.role;
      
      if (userRole === 'retailer') {
        redirect('/retailers-dashboard');
      } else {
        redirect('/dashboard');
      }
    }

    // If user doesn't exist or password is wrong, try to sign up with retailer role
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'retailer', // Save retailer role in user metadata
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/retailers-dashboard`,
      },
    });

    if (signUpError) {
      console.error('Signup error:', signUpError);
      
      // Provide specific error messages
      if (signUpError.message.includes('already registered')) {
        return { error: { message: 'An account with this email already exists. Please log in instead.' } };
      }
      if (signUpError.message.includes('Password should be')) {
        return { error: { message: 'Password must be at least 6 characters long.' } };
      }
      
      return { error: { message: signUpError.message || 'Signup failed. Please try again.' } };
    }

    if (!signUpData.user) {
      console.error('No user data after signup');
      return { error: { message: 'Signup failed. Please try again.' } };
    }

    console.log('Signup successful for user:', signUpData.user.id, 'with role: retailer');
    
    // Try to sign in after successful signup
    const { data: newSignInData, error: newSignInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (newSignInError) {
      console.error('Auto sign-in after signup failed:', newSignInError);
      return { error: { message: 'Account created successfully! Please log in to continue.' } };
    }

    if (newSignInData.session && newSignInData.user) {
      console.log('Auto sign-in successful, redirecting to retailers-dashboard');
      redirect('/retailers-dashboard');
    }

    // If we get here, something unexpected happened
    console.error('Unexpected state after signup and sign in attempt');
    return { error: { message: 'Account created successfully! Please log in to continue.' } };
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
