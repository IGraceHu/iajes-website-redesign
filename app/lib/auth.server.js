function hasCookie(cookieHeader, key, value) {
  if (!cookieHeader) {
    return false;
  }

  const pattern = new RegExp(`(?:^|;\\s*)${key}=${value}(?:;|$)`);
  return pattern.test(cookieHeader);
}

export function isAdminRequest(request) {
  if (process.env.IAJES_DEV_ADMIN === "true") {
    return true;
  }

  const cookie = request.headers.get("cookie") || "";
  const loggedIn = hasCookie(cookie, "iajes_auth", "1");
  const isAdmin = hasCookie(cookie, "iajes_role", "admin");

  return loggedIn && isAdmin;
}
