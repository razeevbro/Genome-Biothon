import "./globals.css";
import { Toaster } from "sonner";
import { Navigation } from "@/components/navigation";

export const metadata = {
  title: "DietSathi",
  description: "Track your meals and hit your goals",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#FCFBF7] text-[#1a1a1a] selection:bg-orange-200 selection:text-orange-900 pb-24 md:pb-0 font-sans antialiased">
        <Navigation />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}