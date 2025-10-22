import { auth } from "@/auth";
import Navbar from "./Navbar";

export default async function NavbarServer() {
  const session = await auth();

  return (
    <Navbar
      session={session}
      users={120}
    />
  );
}
