import { useState, useEffect } from 'react';
import { MemberCreateRequest, MemberUpdateRequest } from '@/shared/types/member.types';
import { createMemberAction, updateMemberAction } from "@/features/member/actions/member.action";
import {UserResponse} from "@/shared/types/auth.types";
import {formatDate} from "@/shared/utils/func.utils"; // Bạn cần tạo file action này

interface Props {
    isOpen: boolean;
    onClose: () => void;
    editingMember: UserResponse | null;
    onSuccess: () => void;
}

export const MemberFormModal = ({ isOpen, onClose, editingMember, onSuccess }: Props) => {
    const [submitLoading, setSubmitLoading] = useState(false);

    const [formData, setFormData] = useState<MemberCreateRequest>({
        email: '', password: '', firstName: '', lastName: '', phone: '', dateOfBirth: ''
    });

    useEffect(() => {
        if (isOpen) {
            if (editingMember) {
                setFormData({
                    email: editingMember.email ?? '',
                    password: '',
                    firstName: editingMember.firstName ?? '',
                    lastName: editingMember.lastName ?? '',
                    phone: editingMember.phone ?? '',
                    dateOfBirth: formatDate(editingMember.dateOfBirth)
                });
            } else {
                setFormData({ email: '', password: '', firstName: '', lastName: '', phone: '', dateOfBirth: '' });
            }
        }
    }, [isOpen, editingMember]);

    if (!isOpen) return null;

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            if (editingMember) {
                const updatePayload: MemberUpdateRequest = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    dateOfBirth: formData.dateOfBirth
                };
                await updateMemberAction(editingMember.id as number, updatePayload);
                alert("Cập nhật thành viên thành công!");
            } else {
                await createMemberAction(formData);
                alert("Thêm thành viên thành công!");
            }
            onSuccess();
            onClose();
        } catch (error) {
            alert(editingMember ? "Cập nhật thất bại!" : "Thêm thành viên thất bại!");
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <h2 className="text-xl font-bold mb-5 text-gray-900 flex items-center gap-2">
                    {editingMember ? (
                        <><svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg> Cập nhật thành viên</>
                    ) : (
                        <><svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg> Thêm thành viên mới</>
                    )}
                </h2>

                <form onSubmit={handleSubmitForm} className="space-y-4">
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Họ</label>
                            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                   value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="Nhập họ..." />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Tên</label>
                            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                   value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="Nhập tên..." />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1 text-gray-700">Email <span className="text-red-500">*</span></label>
                        <input required type="email" disabled={!!editingMember} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:text-gray-500"
                               value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="email@example.com" />
                    </div>

                    {!editingMember && (
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Mật khẩu <span className="text-red-500">*</span></label>
                            <input required type="password" minLength={8} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                   value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Tối thiểu 8 ký tự, gồm chữ và số" />
                        </div>
                    )}

                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Số điện thoại</label>
                            <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                   value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="09xxxxxxxx" />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Ngày sinh</label>
                            <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                   value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} />
                        </div>
                    </div>

                    <div className="p-6 pt-4 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end shrink-0 -mx-6 -mb-6 rounded-b-2xl mt-6">
                        <button
                            type="submit"
                            disabled={submitLoading}
                            className={`px-6 py-2.5 text-white font-bold rounded-xl transition shadow-sm flex items-center gap-2
                            ${editingMember ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}
                            disabled:bg-gray-400 disabled:cursor-not-allowed`}
                        >
                            {submitLoading ? 'Đang xử lý...' : editingMember ? 'Lưu cập nhật' : 'Thêm thành viên'}
                        </button>
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-700 font-bold bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition shadow-sm">
                            Hủy bỏ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};