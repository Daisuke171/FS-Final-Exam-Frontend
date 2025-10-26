import type { Metadata } from "next";
import { ReactNode } from "react";
import { Raleway } from "next/font/google";
// import { ApolloWrapper } from "@/lib/apollo-client";
import { Providers } from "@/app/providers";
import "./globals.css";
//import { Providers } from "@/components/ui/general/Providers";
import NavbarServer from "@/components/ui/general/NabvarServer";
import BottomBar from "@/components/ui/general/BottomBar";
import { auth } from "@/auth";
import Footer from "@/components/ui/general/Footer";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sanya Games",
  description: "Welcome to Sanya Games - Your Ultimate Gaming Hub!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body
        className={`${raleway.variable} min-h-screen bg-gradient-one font-sans antialiased`}
      >
        <Providers session={session}>
          <NavbarServer />
          {children}
          <Footer />
          <BottomBar />
        </Providers>
      </body>
    </html>
  );
}
