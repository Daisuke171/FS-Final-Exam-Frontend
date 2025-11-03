import { gql } from "@apollo/client";

export const MY_FRIENDS = gql`
    query MyFriends($userId: ID!) {
        friendPeersOfUser(userId: $userId) {
            id
            status
            active
            peer {
                id
                nickname
                activeSkin {
                    id
                    name
                    img
                    level
                    value
                }
            }
        }
    }
`;

export const FRIEND_PEERS_OF_USER = gql`
    query FriendPeersOfUser($userId: ID!) {
        friendPeersOfUser(userId: $userId) {
            active
            id
            chatId
            status
            peer {
                id
                nickname
                activeSkin {
                    id
                    img
                    level
                    name
                    value
                }
            }			
        }
    }
`;

export const FRIEND_BASIC = gql`
    query GetFriendById($id: ID!) {
    getFriendById(id: $id) {
        id
        nickname
        activeSkin {
            img
            name
        }
    }
}`;