import { NextRequest, NextResponse } from "next/server";

import { TOKEN_COOKIE_NAME } from "@/lib/auth/config";

const DASHBOARD_SEGMENT = "/dashboard";
const AUTH_SEGMENTS = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = Boolean(request.cookies.get(TOKEN_COOKIE_NAME)?.value);

  const isDashboard = pathname === DASHBOARD_SEGMENT || pathname.startsWith(`${DASHBOARD_SEGMENT}/`);
  const isAuthPage = AUTH_SEGMENTS.includes(pathname);

  // Authenticated users visiting login/register go to the dashboard.
  if (isAuthPage && hasToken) {
    const url = request.nextUrl.clone();
    url.pathname = DASHBOARD_SEGMENT;
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Unauthenticated users cannot access the dashboard.
  if (isDashboard && !hasToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/dashboard", "/dashboard/:path*"],
};