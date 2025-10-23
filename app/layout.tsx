import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import BottomBar from "@/components/ui/general/BottomBar";
import "./globals.css";
import { Providers } from "@/components/ui/general/Providers";
import NavbarServer from "@/components/ui/general/NabvarServer";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sanya Games",
  description: "Welcome to Sanya Games - Your Ultimate Gaming Hub!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${raleway.variable} min-h-screen bg-gradient-one font-sans antialiased`}
      >
        <Providers>
          <NavbarServer />
          {children}
          <BottomBar />
        </Providers>
      </body>
    </html>
  );
}
