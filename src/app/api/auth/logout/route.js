// src/app/api/auth/logout/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Use await with cookies() function
  const cookieStore = await cookies();
  cookieStore.delete("user_session");

  return NextResponse.json({ message: "Logged out successfully" });
}
