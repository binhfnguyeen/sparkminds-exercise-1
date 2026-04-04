'use client';

import React from 'react';

export const MaintenanceScreen = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100 max-w-lg w-full p-10 md:p-12 text-center relative overflow-hidden">

                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-amber-100 rounded-full blur-3xl opacity-60"></div>

                <div className="relative z-10 flex justify-center mb-8">
                    <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                        <svg className="w-12 h-12 text-amber-500 animate-[spin_4s_linear_infinite]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                    </div>
                    <div className="absolute bottom-0 right-1/4 translate-x-4 translate-y-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                        </svg>
                    </div>
                </div>

                <h1 className="relative z-10 text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    Hệ thống đang bảo trì
                </h1>

                <p className="relative z-10 text-gray-500 text-sm md:text-base leading-relaxed mb-8">
                    Chúng tôi đang tiến hành nâng cấp hệ thống để mang lại trải nghiệm tốt hơn.
                    Quá trình này có thể mất một chút thời gian. Quý khách vui lòng quay lại sau nhé!
                </p>

                <button
                    onClick={() => window.location.reload()}
                    className="relative z-10 px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-gray-900/20 active:scale-95 flex items-center justify-center gap-2 mx-auto focus:outline-none"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    Tải lại trang
                </button>

                <div className="relative z-10 mt-10 pt-6 border-t border-gray-100">
                    <p className="text-xs text-gray-400 font-medium">
                        Cần hỗ trợ khẩn cấp? Vui lòng liên hệ <a href="mailto:heulwentech@gmail.com" className="text-blue-500 hover:text-blue-600 font-bold transition-colors">heulwentech@gmail.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
};