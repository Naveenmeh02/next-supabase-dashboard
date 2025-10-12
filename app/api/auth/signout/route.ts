import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.signOut();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error signing out:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to sign out' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
