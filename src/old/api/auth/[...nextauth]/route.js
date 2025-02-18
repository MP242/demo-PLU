import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { LoginUsers } from "@/action/ManageUsers";

const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {},
            async authorize(credentials) {
                const res = await LoginUsers(credentials);
                if (res === "User not found")
                    throw new Error("Une erreur s'est produite");
                if (res === "Wrong password")
                    throw new Error("Mot de passe incorrect");
                return res;
            }
        })
    ],
    pages: {
        signIn: "/auth/signin",
    },
    session: {
        jwt: true,
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.role = token.role;
            session.user.id = token.id;
            return session;
        }
    },
};


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
