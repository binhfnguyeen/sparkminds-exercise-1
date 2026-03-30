import LoginForm from "@/features/auth/components/LoginForm";

export const metadata = {
    title: 'Đăng nhập | SparkMinds',
};

export default function LoginPage() {
    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-50">
            <LoginForm />
        </main>
    );
}