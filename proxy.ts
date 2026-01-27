import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// Next.js 16 expects a default export named `proxy` (formerly middleware).
export default async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

  // If user is on auth page and has token, redirect to dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is trying to access dashboard without token, redirect to login
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Check role-based access
  if (isDashboardPage && token?.role !== "admin" && token?.role !== "vendor") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
