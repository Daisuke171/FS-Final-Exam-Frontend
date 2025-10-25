import { gql } from "@apollo/client";

export const FRIEND_EVENT = gql`
    subscription FriendEvent($userId: ID!) {
        friendEvent(userId: $userId) {
            type
            userId
            friendId
        }
    }
`;