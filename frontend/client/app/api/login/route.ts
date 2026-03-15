import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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

    console.log("data after login in next api ")

     if (!response.ok) {
    return NextResponse.json(data, { status: 401 });
  }

  const res = NextResponse.json({ message: "loggedin" });

  const cookieStore = await cookies();

  cookieStore.set("token", data.token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24
  });


  return NextResponse.json({
    message: "loggedin",
  });
}