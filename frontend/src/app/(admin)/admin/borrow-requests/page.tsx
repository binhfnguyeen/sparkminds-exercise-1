import { AdminBorrowManagement } from '@/features/book/components/AdminBorrowManagement';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Quản lý Mượn Sách | Admin Dashboard',
    description: 'Xét duyệt và quản lý các yêu cầu mượn sách của hệ thống',
};

export default function AdminBorrowRequestsPage() {
    return (
        <div className="min-h-screen bg-gray-50/30">
            <AdminBorrowManagement />
        </div>
    );
}