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
    callbacks: {
        async jwt({ token }) {
            token.userRole = "admin"
            return token
        },
    },
});

export { handler as GET, handler as POST }