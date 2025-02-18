import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req: NextRequestWithAuth, res) {
    if (
      req.nextauth?.token?.role !== "admin" &&
      (req.nextUrl.pathname.startsWith("/intergration") ||
        req.nextUrl.pathname.startsWith("/utilisateur"))
    ) {
      return NextResponse.rewrite(new URL("/denied", req.nextUrl));
    }

    if (!req.nextauth?.token) {
      return NextResponse.redirect("/auth/signin");
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/intergration",
    "/prospects",
    "/utilisateur",
    "/rdv",
    "/map",
    "/dashboard",
  ],
};
