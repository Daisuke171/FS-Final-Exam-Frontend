import { auth } from "@/auth";
import FriendsPage from "@/modules/friends/FriendPage";

export default async function NavbarServer() {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const accessToken = session?.accessToken;
  
  return (
    <FriendsPage
      session={session}
      userId={userId}
      accessToken={accessToken}
    />
  );
}
