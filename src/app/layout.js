import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers"; 
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/utils/sidebar";
import Header from "@/utils/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Interview Guide",
  description: "AI Interview Guide",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex flex-col w-screen">
          <Providers>
                <div className="flex flex-col w-full h-full">
                  <Header />
                  {children}
                </div>
          </Providers>
        </div>
      </body>
    </html>
  );
}
