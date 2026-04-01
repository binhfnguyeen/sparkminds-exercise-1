import "./globals.css";
import {GoogleOAuthProvider} from "@react-oauth/google";

export default function RootLayout({ children }: { children: React.ReactNode; }) {
    return (
        <html lang="vi">
            <body>
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
                    {children}
                </GoogleOAuthProvider>
            </body>
        </html>
    );
}
