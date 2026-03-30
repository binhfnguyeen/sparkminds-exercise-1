import Header from "@/shared/components/Footer";
import Footer from "@/shared/components/Header";

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