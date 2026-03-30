import LoginForm from '@/features/auth/components/LoginForm';

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
            <LoginForm />
        </div>
    );
}