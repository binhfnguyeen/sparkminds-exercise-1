import { getAllBorrowRequestsAdminAction } from '@/features/book/actions/book.action';
import { AdminBorrowManagement } from '@/features/book/components/AdminBorrowManagement';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Quản lý Mượn Sách | Admin Dashboard',
    description: 'Xét duyệt và quản lý các yêu cầu mượn sách của hệ thống',
};

export default async function AdminBorrowRequestsPage() {
    try {
        const response = await getAllBorrowRequestsAdminAction();

        if (response.code === 401 || response.code === 403) {
            redirect('/admin/login');
        }

        const borrowRequests = response.code === 1000 ? response.result : [];

        return (
            <div className="min-h-screen bg-gray-50/30">
                <AdminBorrowManagement initialData={borrowRequests} />
            </div>
        );
    } catch (error) {
        console.error("Lỗi khi tải danh sách yêu cầu mượn sách:", error);

        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-md w-full">
                    <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Lỗi tải dữ liệu</h2>
                    <p className="text-gray-500 mb-6">
                        Không thể kết nối đến máy chủ hoặc đã xảy ra lỗi trong quá trình lấy dữ liệu.
                    </p>
                    <button
                        className="px-6 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        <a href="/admin/borrow-requests">Thử lại ngay</a>
                    </button>
                </div>
            </div>
        );
    }
}