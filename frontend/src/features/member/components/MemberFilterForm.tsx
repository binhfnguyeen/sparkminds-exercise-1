import { useState } from 'react';
import {formatDate} from "@/shared/utils/func.utils";

interface Props {
    onSearch: (params: { keyword?: string; dobFrom?: string; dobTo?: string, sortBy?: string, sortDir?: string }) => void;
}

export const MemberFilterForm = ({ onSearch }: Props) => {
    const [keyword, setKeyword] = useState('');
    const [dobFrom, setDobFrom] = useState('');
    const [dobTo, setDobTo] = useState('');
    const [sortBy, setSortBy] = useState('id');
    const [sortDir, setSortDir] = useState('DESC');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch({
            keyword: keyword.trim() || undefined,
            dobFrom: formatDate(dobFrom) || undefined,
            dobTo: formatDate(dobTo) || undefined,
            sortBy,
            sortDir
        });
    };

    const handleReset = () => {
        setKeyword('');
        setDobFrom('');
        setDobTo('');
        onSearch({ keyword: undefined, dobFrom: undefined, dobTo: undefined });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-semibold mb-1.5 text-gray-700">Tìm kiếm</label>
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Nhập tên, email..."
                />
            </div>

            <div className="w-40">
                <label className="block text-sm font-semibold mb-1.5 text-gray-700">Ngày sinh (Từ)</label>
                <input
                    type="date"
                    value={dobFrom}
                    onChange={(e) => setDobFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
            </div>

            <div className="w-40">
                <label className="block text-sm font-semibold mb-1.5 text-gray-700">Ngày sinh (Đến)</label>
                <input
                    type="date"
                    value={dobTo}
                    onChange={(e) => setDobTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
            </div>

            <div className="w-32">
                <label className="block text-sm font-semibold mb-1.5 text-gray-700">Sắp xếp theo</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="id">ID</option>
                    <option value="email">Email</option>
                    <option value="firstName">Họ</option>
                    <option value="lastName">Tên</option>
                </select>
            </div>
            <div className="w-32">
                <label className="block text-sm font-semibold mb-1.5 text-gray-700">Thứ tự</label>
                <select value={sortDir} onChange={e => setSortDir(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="DESC">Giảm dần</option>
                    <option value="ASC">Tăng dần</option>
                </select>
            </div>

            <div className="flex gap-2">
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    Lọc
                </button>
                <button type="button" onClick={handleReset} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition text-sm border border-gray-200">
                    Đặt lại
                </button>
            </div>
        </form>
    );
};