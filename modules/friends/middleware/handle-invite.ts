/* import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function handleInviteMiddleware(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const accessToken = session?.accessToken;

  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  
  if (url.pathname === "/invite/friend" && token) {
    if (!userId) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const res = NextResponse.next();
    res.cookies.set("pendingInvite", token, { httpOnly: true, path: "/" });
    return res;
  }
  return NextResponse.next();
}


 */