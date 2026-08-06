import { type ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";
import ScrollToTop from "./ScrollToTop";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-[#0f172a] text-white">
      <ScrollToTop />
      <Header />

      <main className="pt-[136px] min-h-screen">{children}</main>

      <Footer />
    </div>
  );
}
