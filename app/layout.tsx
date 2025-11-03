import type { Metadata } from "next";
import { ReactNode } from "react";
import { Raleway } from "next/font/google";
import { Providers } from "@/app/providers";
import "./globals.css";
import NavbarServer from "@/components/ui/general/NabvarServer";
import BottomBar from "@/components/ui/general/BottomBar";
import { auth } from "@/auth";
import Footer from "@/components/ui/general/Footer";
import AIChatbot from "@/components/ui/ai-chatbot/AIChatbot";
import { ToastProvider } from "@/context/ToastContext";

import CallLayer from "@/modules/call/ui/CallLayer";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sanya Games",
  description: "Welcome to Sanya Games - Your Ultimate Gaming Hub!",
  icons: {
    icon: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await auth();
  const currentUserId = session?.user?.id as string; // si no tienes usuario, no usar


  return (
    <html lang="en">
      <body
        className={`${raleway.variable} min-h-screen bg-gradient-one font-sans antialiased`}
      >
        <Providers session={session}>
          <ToastProvider>
            <NavbarServer />
            {children}
            <BottomBar />
            <Footer />
            <AIChatbot />
            <CallLayer currentUserId={currentUserId} />
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
