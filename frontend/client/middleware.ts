import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

     if (token && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
    }


    if(!token && (request.nextUrl.pathname.startsWith("/file") || request.nextUrl.pathname.startsWith("/upload"))) {
        return NextResponse.redirect(new URL("/login",request.url));
    }

    return NextResponse.next();
}