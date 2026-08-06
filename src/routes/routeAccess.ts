import { matchPath } from "react-router-dom";

const publicRoutePaths = [
  "/",
  "/contact",
  "/login",
  "/signup",
  "/confirm-email-change",
  "/blog",
  "/blog/:slug",
  "/reset-password",
];

const guestOnlyRoutePaths = ["/login", "/signup"];

function matchesRoute(pathname: string, routes: string[]) {
  return routes.some((path) => matchPath({ path, end: true }, pathname));
}

export function isPublicRoute(pathname: string) {
  return matchesRoute(pathname, publicRoutePaths);
}

export function isGuestOnlyRoute(pathname: string) {
  return matchesRoute(pathname, guestOnlyRoutePaths);
}
