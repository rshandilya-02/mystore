import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {

    const body = await req.json();

    console.log("LOGIN BODY:", body);

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

    console.log("BACKEND RESPONSE:", data);

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    const cookieStore = await cookies();

    cookieStore.set("token", data.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24
    });

    return NextResponse.json({
      message: "loggedin"
    });

  } catch (error) {

    console.error("LOGIN ROUTE ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}