import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

import {createMiddlewareClient} from "@supabase/auth-helpers-nextjs";

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  const supabase = createMiddlewareClient({req, res});
  const {data: sessionData } = await supabase.auth.getSession();
  const user_id = sessionData?.session?.user.id;
  const { data: userData } = await supabase.from('user').select('*').eq('id', user_id).single();  

  // protected routes
  if (pathname === "/profile" && !sessionData?.session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname === "/create_post" && !sessionData?.session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname === "/postsUser" && !sessionData?.session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname === "/" && sessionData?.session) {
    return NextResponse.redirect(new URL("/postsUser", req.url));
  }

  if (pathname === "/postsAdmin" && !sessionData?.session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname === "/postsAdmin" && sessionData?.session && userData.role !== "admin") {
    return NextResponse.redirect(new URL("/postsUser", req.url));
  }

  if (pathname === "/postsUser" && sessionData?.session && userData.role !== "user") {
    return NextResponse.redirect(new URL("/postsAdmin", req.url));
  }

  return res;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/profile", "/admin", "/", "/postsUser", "/create_post"]
};
