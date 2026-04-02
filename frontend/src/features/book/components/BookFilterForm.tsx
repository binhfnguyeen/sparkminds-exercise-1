import React from 'react';

interface Props {
    keyword: string; setKeyword: (v: string) => void;
    fromTime: string; setFromTime: (v: string) => void;
    toTime: string; setToTime: (v: string) => void;
    sortBy: string; setSortBy: (v: string) => void;
    sortDir: string; setSortDir: (v: string) => void;
    onSearch: (e: React.FormEvent) => void;
    onClear: () => void;
}

export const BookFilterForm = ({ keyword, setKeyword, fromTime, setFromTime, toTime, setToTime, sortBy, setSortBy, sortDir, setSortDir, onSearch, onClear }: Props) => {
    return (
        <form onSubmit={onSearch} className="mb-6 bg-gray-50 p-5 rounded-xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2 relative">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tìm kiếm từ khóa</label>
                    <svg className="w-5 h-5 absolute left-3 top-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input type="text" placeholder="Tìm tên sách, tác giả..." value={keyword} onChange={(e) => setKeyword(e.target.value)}
                           className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Từ ngày</label>
                    <input type="date" value={fromTime} onChange={(e) => setFromTime(e.target.value)}
                           className="w-full px-3 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white text-gray-700" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Đến ngày</label>
                    <input type="date" value={toTime} onChange={(e) => setToTime(e.target.value)}
                           className="w-full px-3 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white text-gray-700" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Sắp xếp theo</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white text-gray-700">
                        <option value="id">ID (Mới tạo)</option>
                        <option value="title">Tên sách</option>
                        <option value="author">Tác giả</option>
                        <option value="quantity">Số lượng</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Thứ tự</label>
                    <select value={sortDir} onChange={(e) => setSortDir(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white text-gray-700">
                        <option value="DESC">Giảm dần (Mới nhất)</option>
                        <option value="ASC">Tăng dần (Cũ nhất)</option>
                    </select>
                </div>
                <div className="lg:col-span-2 flex items-end gap-3">
                    <button type="submit" className="flex-1 bg-slate-900 text-white py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition-colors text-sm shadow-sm flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                        Lọc dữ liệu
                    </button>
                    <button type="button" onClick={onClear} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm shadow-sm">
                        Xóa bộ lọc
                    </button>
                </div>
            </div>
        </form>
    );
};