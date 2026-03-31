const USERS_COOKIE = "weatherme_users";
const USERS_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
const DEFAULT_USERS = [{ username: "admin", password: "password" }];

function normalizeUsername(username = "") {
  return username.trim().toLowerCase();
}

function parseCookieHeader(cookieHeader = "") {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((cookies, part) => {
      const separatorIndex = part.indexOf("=");

      if (separatorIndex === -1) {
        return cookies;
      }

      const key = part.slice(0, separatorIndex);
      const value = part.slice(separatorIndex + 1);
      cookies[key] = value;
      return cookies;
    }, {});
}

function encodeUsers(users) {
  return Buffer.from(JSON.stringify(users), "utf8").toString("base64url");
}

function decodeUsers(value) {
  if (!value) {
    return null;
  }

  try {
    const parsedUsers = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8")
    );

    if (Array.isArray(parsedUsers)) {
      return parsedUsers;
    }
  } catch {
    return null;
  }

  return null;
}

function getCookieHeader(request) {
  if (!request?.headers) {
    return "";
  }

  if (typeof request.headers.get === "function") {
    return request.headers.get("cookie") ?? "";
  }

  return request.headers.cookie ?? "";
}

export function getUsersFromCookieHeader(cookieHeader = "") {
  const cookies = parseCookieHeader(cookieHeader);
  return decodeUsers(cookies[USERS_COOKIE]) || DEFAULT_USERS;
}

export function findUserByUsername(users, username) {
  const normalizedUsername = normalizeUsername(username);

  if (!normalizedUsername) {
    return null;
  }

  return (
    users.find(
      (user) => normalizeUsername(user.username) === normalizedUsername
    ) || null
  );
}

export function registerUser(users, { username, password }) {
  const trimmedUsername = username?.trim();

  if (!trimmedUsername || !password) {
    throw new Error("Username and password are required");
  }

  if (findUserByUsername(users, trimmedUsername)) {
    return { created: false, users };
  }

  const nextUsers = [
    ...users,
    {
      username: trimmedUsername,
      password,
    },
  ];

  return {
    created: true,
    users: nextUsers,
    user: { username: trimmedUsername },
  };
}

export function buildUsersCookieValue(users) {
  return encodeUsers(users);
}

export function getUsersCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: USERS_COOKIE_MAX_AGE,
  };
}

export function getUsersFromRequest(request) {
  return getUsersFromCookieHeader(getCookieHeader(request));
}
