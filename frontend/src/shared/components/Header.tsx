import Link from 'next/link';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm backdrop-blur-md bg-white/90">
            <div className="container flex items-center justify-between h-16 px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">

                {/* Logo & Navigation */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-2xl font-extrabold tracking-tight text-blue-600 transition-transform hover:scale-105">
                        Book<span className="text-gray-900">Book</span>
                    </Link>

                    <nav className="hidden md:flex gap-6">
                        <Link href="/" className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600">Trang chủ</Link>
                        <Link href="#" className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600">Khóa học</Link>
                        <Link href="#" className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600">Về chúng tôi</Link>
                    </nav>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/client/login"
                        className="px-5 py-2 text-sm font-semibold text-white transition-all duration-200 bg-blue-600 rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Đăng nhập
                    </Link>
                    <Link href="/client/register" className="px-5 py-2 text-sm font-semibold text-gray-700 transition-colors hover:text-blue-600">
                        Đăng ký
                    </Link>
                </div>

            </div>
        </header>
    );
}