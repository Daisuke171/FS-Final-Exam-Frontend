import { auth } from "@/auth";
import FriendsPage from "@/modules/friends/FriendPage";
import { redirect } from "next/navigation";

export default async function NavbarServer() {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const accessToken = session?.accessToken;

  if (!userId || !accessToken) {
    return redirect("/login");
  }

  return (
    <div className="w-full h-screen flex items-center">
      <FriendsPage
        session={session}
        userId={userId}
      />
    </div>
  );
}
