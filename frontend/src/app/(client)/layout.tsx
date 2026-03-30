import Header from "@/shared/components/Header";
import Footer from "@/shared/components/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header/>

            <main className="flex-grow">
                {children}
            </main>

            <Footer/>
        </div>
    )
}