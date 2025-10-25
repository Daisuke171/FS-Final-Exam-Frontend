import { apolloClientServer } from "@/lib/apollo-client-server";
import { auth } from "@/auth";
import { ACCEPT_INVITE_FRIEND } from "@shared/lib/graphql/queries/friend.gql";

export async function acceptInviteFriendServer(token: string) {
  const session = await auth();
  if (!session) throw new Error("UNAUTHENTICATED");

  const { data, errors } = await apolloClientServer.mutate({
    mutation: ACCEPT_INVITE_FRIEND,
    variables: { input: { receiverId: session.user.id, token } },
  });

  if (errors?.length) {
    throw new Error(errors.map((e: any) => e.message).join(", "));
  }

  return data.acceptFriendInvite || null;
}
