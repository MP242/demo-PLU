import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    expires: Date;
    user: {
        email: string;
        role: string;
        id: string;
        thread: string;
    };
  }
}
