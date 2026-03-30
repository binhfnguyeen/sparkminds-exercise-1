import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
            <div className="container px-4 py-12 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">

                    {/* Brand & Description */}
                    <div className="md:col-span-2">
                        <Link href="/" className="text-2xl font-extrabold tracking-tight text-blue-600">
                            Book<span className="text-gray-900">Book</span>
                        </Link>
                        <p className="mt-4 text-sm leading-relaxed text-gray-500 max-w-sm">
                            Nền tảng đào tạo và quản lý học tập toàn diện. Khám phá tiềm năng của bạn và xây dựng sự nghiệp vững chắc cùng hệ thống của chúng tôi.
                        </p>
                    </div>

                    {/* Links Group 1 */}
                    <div>
                        <h3 className="text-sm font-bold tracking-wider text-gray-900 uppercase">Liên kết</h3>
                        <ul className="mt-4 space-y-3">
                            <li><Link href="#" className="text-sm text-gray-600 transition-colors hover:text-blue-600">Trang chủ</Link></li>
                            <li><Link href="#" className="text-sm text-gray-600 transition-colors hover:text-blue-600">Về chúng tôi</Link></li>
                            <li><Link href="#" className="text-sm text-gray-600 transition-colors hover:text-blue-600">Tuyển dụng</Link></li>
                        </ul>
                    </div>

                    {/* Links Group 2 */}
                    <div>
                        <h3 className="text-sm font-bold tracking-wider text-gray-900 uppercase">Hỗ trợ</h3>
                        <ul className="mt-4 space-y-3">
                            <li><Link href="#" className="text-sm text-gray-600 transition-colors hover:text-blue-600">Trung tâm trợ giúp</Link></li>
                            <li><Link href="#" className="text-sm text-gray-600 transition-colors hover:text-blue-600">Bảo mật</Link></li>
                            <li><Link href="#" className="text-sm text-gray-600 transition-colors hover:text-blue-600">Điều khoản sử dụng</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 mt-12 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} BookBook. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}