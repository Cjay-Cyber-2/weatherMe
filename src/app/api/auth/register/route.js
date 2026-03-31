import { NextResponse } from "next/server";
import { createUser } from "@/lib/authStore";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    const result = await createUser({ username, password });

    if (!result.created) {
      return NextResponse.json(
        { message: "Username already exists!" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Account created successfully!", user: result.user },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "An error occurred during registration." },
      { status: 500 }
    );
  }
}
