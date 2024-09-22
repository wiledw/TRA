import {supabaseRouteHandler} from "@/app/utils/supabase";
import {cookies} from "next/headers";
import {NextRequest, NextResponse} from "next/server";

export async function GET(req: NextRequest) {
  const reqUrl = new URL(req.url);
  const code = reqUrl.searchParams.get("code");
 
  if (code) {
    const supabase = supabaseRouteHandler(cookies);
    await supabase.auth.exchangeCodeForSession(code);
  }
   
  // Check if the error description indicates a database error
  const errorDescription = reqUrl.searchParams.get('error_description');
  if (errorDescription === 'Database error saving new user') {
    // Redirect to login page if there is a specific database error
    return NextResponse.redirect(reqUrl.origin + "/login");
  }

  return NextResponse.redirect(reqUrl.origin);
}