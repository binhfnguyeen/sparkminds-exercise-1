import {useRouter, useSearchParams} from "next/navigation";
import {MfaSetupForm} from "@/features/auth/components/MfaSetupForm";
import {PasswordSettingForm} from "@/features/auth/components/PasswordSettingForm";
import {EmailSettingForm} from "@/features/auth/components/EmailSettingForm";

export const SettingsContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const currentTab = searchParams.get('tab') || 'mfa';

    const handleTabChange = (tabId: string) => {
        router.push(`/client/settings?tab=${tabId}`);
    };

    const TABS = [
        { id: 'mfa', label: 'Bảo mật & MFA', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
        { id: 'password', label: 'Đổi Mật Khẩu', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
        { id: 'email', label: 'Đổi Email', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
    ];

    return (
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            <aside className="w-full md:w-56 flex-shrink-0"> {/* Đổi w-64 thành w-56 */}
                <nav className="flex flex-col gap-1 p-1.5 bg-gray-50/50 rounded-2xl border border-gray-100"> {/* Giảm gap-1.5 xuống gap-1, p-2 xuống p-1.5 */}
                    {TABS.map((tab) => {
                        const isActive = currentTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left text-sm font-semibold ${ /* Giảm gap-3 -> 2.5, px-4 py-3 -> px-3 py-2.5 */
                                    isActive
                                        ? 'bg-white text-blue-600 shadow-sm border border-gray-100/80 ring-1 ring-black/5'
                                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 border border-transparent'
                                }`}
                            >
                                <svg className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"> {/* Giảm w-5 h-5 -> w-4 h-4 */}
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon}></path>
                                </svg>
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </aside>
            <main className="flex-1 min-h-[500px]">
                {currentTab === 'mfa' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <MfaSetupForm />
                    </div>
                )}
                {currentTab === 'password' && <PasswordSettingForm />}
                {currentTab === 'email' && <EmailSettingForm />}
            </main>
        </div>
    );
}