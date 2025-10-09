// Nested layout for the CodingWar app route
export const metadata = {
  title: "CodingWar",
  description: "Real-time coding game",
};

import { SocketProvider } from "./provider/SocketContext";

export default function CodingWarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>
        <SocketProvider>{children}</SocketProvider>
      </div>
    </>
  );
}
