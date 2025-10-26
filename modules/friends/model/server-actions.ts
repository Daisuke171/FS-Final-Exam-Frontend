import { apolloClientServer } from "@/lib/apollo-client-server";
import { auth } from "@/auth";
import { ACCEPT_INVITE_FRIEND } from "@shared/lib/graphql/queries/friend.gql";

interface AcceptFriendInviteData {
  acceptFriendInvite: {
    id: string;
    status: string;
    // Add other fields as needed
  };
}

export async function acceptInviteFriendServer(token: string) {
  const session = await auth();
  if (!session) throw new Error("UNAUTHENTICATED");

  const result = await apolloClientServer.mutate<AcceptFriendInviteData>({
    mutation: ACCEPT_INVITE_FRIEND,
    variables: { input: { receiverId: session.user.id, token } },
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data?.acceptFriendInvite || null;
}
