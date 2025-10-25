import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { acceptInviteFriendServer  } from "@/modules/friends/model/server-actions";

export default async function InviteFriendPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token;
  if (!token) redirect("/?err=missing_invite_token");

  const session = await auth();
  if (!session) redirect(`/login?callbackUrl=/invite/friend?token=${token}`);

  try {
    await acceptInviteFriendServer(token);
    redirect("/friends");
  } catch (_) {
    console.error(_)
    redirect("/friends?invite=error");
  }
}

