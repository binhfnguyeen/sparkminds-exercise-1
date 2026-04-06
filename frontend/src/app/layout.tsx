import "./globals.css";
import {GoogleOAuthProvider} from "@react-oauth/google";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '415209795379-fdvdvu59mam6itn486t81u150f8egc76.apps.googleusercontent.com';

export default function RootLayout({ children }: { children: React.ReactNode; }) {
    return (
        <html lang="vi">
            <body>
                <GoogleOAuthProvider clientId={clientId}>
                    {children}
                </GoogleOAuthProvider>
            </body>
        </html>
    );
}
