import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name: string) {
					return request.cookies.get(name)?.value;
				},
				set(name: string, value: string, options: CookieOptions) {
					request.cookies.set({
						name,
						value,
						...options,
					});
					response = NextResponse.next({
						request: {
							headers: request.headers,
						},
					});
					response.cookies.set({
						name,
						value,
						...options,
					});
				},
				remove(name: string, options: CookieOptions) {
					request.cookies.set({
						name,
						value: "",
						...options,
					});
					response = NextResponse.next({
						request: {
							headers: request.headers,
						},
					});
					response.cookies.set({
						name,
						value: "",
						...options,
					});
				},
			},
		}
	);

	const { data: { session } } = await supabase.auth.getSession();
	const pathname = request.nextUrl.pathname;

	// Redirect authenticated users from /auth to their appropriate dashboard
	if (session && pathname === '/auth') {
		const userRole = session.user.user_metadata?.role;
		
		if (userRole === 'retailer') {
			return NextResponse.redirect(new URL('/retailers-dashboard', request.url));
		} else {
			return NextResponse.redirect(new URL('/dashboard', request.url));
		}
	}

	// Protect /retailers-dashboard route - only for authenticated retailers
	if (pathname.startsWith('/retailers-dashboard')) {
		if (!session) {
			return NextResponse.redirect(new URL('/auth', request.url));
		}

		const userRole = session.user.user_metadata?.role;
		
		if (userRole !== 'retailer') {
			return NextResponse.redirect(new URL('/dashboard', request.url));
		}
	}

	return response;
}

export const config = {
	matcher: ['/', '/auth', '/dashboard/:path*', '/retailers-dashboard/:path*'],
};
