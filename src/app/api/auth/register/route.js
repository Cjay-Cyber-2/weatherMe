import { NextResponse } from "next/server";
import {
  buildUsersCookieValue,
  getUsersCookieOptions,
  getUsersFromRequest,
  registerUser,
} from "@/lib/authStore";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    const result = registerUser(getUsersFromRequest(request), {
      username,
      password,
    });

    if (!result.created) {
      return NextResponse.json(
        { message: "Username already exists!" },
        { status: 409 }
      );
    }

    const response = NextResponse.json(
      { message: "Account created successfully!", user: result.user },
      { status: 201 }
    );

    response.cookies.set(
      "weatherme_users",
      buildUsersCookieValue(result.users),
      getUsersCookieOptions()
    );

    return response;
  } catch {
    return NextResponse.json(
      { message: "An error occurred during registration." },
      { status: 500 }
    );
  }
}
