import type { Metadata } from "next";
import { ReactNode } from "react";
import { Raleway } from "next/font/google";
// import { ApolloWrapper } from "@/lib/apollo-client";
import { Providers } from "@/app/providers";
import "./globals.css";
//import { Providers } from "@/components/ui/general/Providers";
import NavbarServer from "@/components/ui/general/NabvarServer";

const raleway = Raleway({
	variable: "--font-raleway",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Sanya Games",
	description: "Juegos de mesa y tablero para jugar con amigos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
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
