import { NextResponse } from "next/server";

// We attach the mock users map to the global object to prevent Next.js from
// resetting our "database" every time the page hot reloads during development.
if (!global.mockUsersDB) {
  global.mockUsersDB = [{ username: "admin", password: "password" }];
}

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = global.mockUsersDB.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );

    if (existingUser) {
      return NextResponse.json(
        { message: "Username already exists!" },
        { status: 409 }
      );
    }

    // Create the new user and push to our "database"
    const newUser = { username, password };
    global.mockUsersDB.push(newUser);

    return NextResponse.json(
      { message: "Account created successfully!", user: { username } },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred during registration." },
      { status: 500 }
    );
  }
}
