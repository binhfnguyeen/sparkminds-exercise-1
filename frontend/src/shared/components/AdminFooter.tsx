'use client';

export const AdminFooter = () => {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium text-gray-500">
                <p>© {new Date().getFullYear()} Library Management System. All rights reserved.</p>

                <div className="flex flex-wrap gap-4 md:gap-6">
                    {/* Link Tài liệu HDSD */}
                    <a href="#" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                        Tài liệu HDSD
                    </a>

                    {/* Link Hỗ trợ kỹ thuật */}
                    <a href="#" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        Hỗ trợ kỹ thuật
                    </a>

                    {/* Link Báo cáo sự cố */}
                    <a href="#" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                        </svg>
                        Báo cáo sự cố
                    </a>
                </div>
            </div>
        </footer>
    );
};