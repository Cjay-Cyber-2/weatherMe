import { promises as fs } from "fs";
import path from "path";

const DATA_DIRECTORY = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIRECTORY, "users.json");
const DEFAULT_USERS = [{ username: "admin", password: "password" }];

function normalizeUsername(username = "") {
  return username.trim().toLowerCase();
}

async function writeUsers(users) {
  await fs.mkdir(DATA_DIRECTORY, { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

export async function getUsers() {
  try {
    await fs.mkdir(DATA_DIRECTORY, { recursive: true });
    const rawUsers = await fs.readFile(USERS_FILE, "utf8");
    const parsedUsers = JSON.parse(rawUsers);

    if (Array.isArray(parsedUsers)) {
      return parsedUsers;
    }
  } catch {
    // Fall back to the default local user store the first time the app runs.
  }

  await writeUsers(DEFAULT_USERS);
  return DEFAULT_USERS;
}

export async function findUserByUsername(username) {
  const normalizedUsername = normalizeUsername(username);

  if (!normalizedUsername) {
    return null;
  }

  const users = await getUsers();

  return (
    users.find(
      (user) => normalizeUsername(user.username) === normalizedUsername
    ) || null
  );
}

export async function createUser({ username, password }) {
  const trimmedUsername = username?.trim();

  if (!trimmedUsername || !password) {
    throw new Error("Username and password are required");
  }

  const users = await getUsers();
  const existingUser = users.find(
    (user) =>
      normalizeUsername(user.username) === normalizeUsername(trimmedUsername)
  );

  if (existingUser) {
    return { created: false };
  }

  const newUser = {
    username: trimmedUsername,
    password,
  };

  users.push(newUser);
  await writeUsers(users);

  return {
    created: true,
    user: { username: trimmedUsername },
  };
}
