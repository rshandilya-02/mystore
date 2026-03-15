import { NextResponse } from "next/server";

export async function POST(req:Request) {
    const body = await req.json();

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
    );

    const data = await response.json();

     if (!response.ok) {
    return NextResponse.json(data, { status: 401 });
  }

  const res = NextResponse.json({ message: "loggedin" });

  res.cookies.set("token", data.token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24
  });
}