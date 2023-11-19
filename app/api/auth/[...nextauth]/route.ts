import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth/jwt" {
    interface JWT {
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
            try {
                console.log("JWT Callback:", token);
                return Promise.resolve(token);
            } catch (error) {
                console.error("Error in JWT callback:", error);
                throw error;
            }
        },
        async session({ session, user }: { session: any; user: any }) {
            try {
                console.log("Session Callback:", session);
                return Promise.resolve(session);
            } catch (error) {
                console.error("Error in session callback:", error);
                throw error;
            }
        },
    },

});

export { handler as GET, handler as POST }