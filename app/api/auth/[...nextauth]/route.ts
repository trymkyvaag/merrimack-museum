import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth/jwt" {
    interface JWT {
        /** The user's role. */
        userRole?: "admin"
    }
}

const handler = NextAuth({
    theme: {
        colorScheme: "auto", // "auto" | "dark" | "light"
        brandColor: "", // Hex color code
        logo: "https://next-auth.js.org/img/logo/logo-sm.png",
        buttonText: "" // Hex color code
    },
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID ?? "",
            clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
            authorization: {
                params: {
                  prompt: "consent",
                  access_type: "offline",
                  response_type: "code"
                }
            }
        }),
    ],
    session: {
        maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
        async jwt({ token, user }: { token: any; user: any }) {
            // console.log("JWT Callback:", token);
            return Promise.resolve(token);
          },
          async session({ session, user }: { session: any; user: any }) {
            // console.log("Session Callback:", session);
            return Promise.resolve(session);
          },
    },
});

export { handler as GET, handler as POST }