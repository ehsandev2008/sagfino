import AuthProvider from "../components/auth/AuthProvider";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Toaster } from "../components/ui/toast";
import "./globals.css";

export const metadata = {
  title: "سقفینو | بازار املاک و مستغلات ایران",
  description: "پروژه بزرگ املاک سقفینو",
};

export default function RootLayout({ children }) {
  return (
    <>
      <link rel="fav-icon" href="/logos/logo-primary.webp" />

      <html lang="fa" dir="rtl" className="h-full antialiased">
        <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
          <AuthProvider>
            <Header />
            <main className="flex-1 pt-24 lg:pt-32">{children}</main>
            <Footer />
            <Toaster position="top-center" />
          </AuthProvider>
        </body>
      </html>
    </>
  );
}
