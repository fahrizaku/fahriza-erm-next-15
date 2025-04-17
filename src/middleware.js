//file middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const userSession = request.cookies.get("user_session");

  // If user is logged in and trying to access auth pages, redirect to dashboard
  if (userSession) {
    if (
      request.nextUrl.pathname === "/auth/login" ||
      request.nextUrl.pathname === "/auth/register" ||
      request.nextUrl.pathname === "/forgot-password" ||
      request.nextUrl.pathname === "/reset-password"
    ) {
      return NextResponse.redirect(new URL("/pasien", request.url));
    }
  }

  // If user is not logged in and trying to access protected routes, redirect to login
  if (!userSession) {
    if (
      request.nextUrl.pathname.startsWith("/apotek") ||
      request.nextUrl.pathname.startsWith("/pasien") ||
      request.nextUrl.pathname.startsWith("/rawat-jalan") ||
      request.nextUrl.pathname.startsWith("/rekam-medis") ||
      request.nextUrl.pathname.startsWith("/vaksin") ||
      request.nextUrl.pathname.startsWith("/file-sharing") ||
      request.nextUrl.pathname.startsWith("/laboratorium") ||
      request.nextUrl.pathname.startsWith("/pemeriksaan-dokter")
    ) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/auth/login",
    "/auth/register",
    "/forgot-password",
    "/reset-password",
    "/apotek/:path*",
    "/pasien/:path*",
    "/rawat-jalan/:path*",
    "/rekam-medis/:path*",
    "/vaksin/:path*",
    "/file-sharing/:path*",
    "/laboratorium/:path*",
    "/pemeriksaan-dokter/:path*",
  ],
};
