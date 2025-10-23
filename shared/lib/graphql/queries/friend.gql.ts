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
			chatId
		}
	}
`;


export const CREATE_FRIEND_INVITE_BY_USERNAME = gql`
	mutation CreateFriendInvite($input: CreateFriendInviteInputByUsername!) {
		requestFriendByUsername(input: $input)
	}
`;

export const CREATE_FRIEND_INVITE = gql`
	mutation CreateFriendInvite($input: CreateFriendInviteInput!) {
		createFriendInvite(input: $input) 
	}
`;


export const REQUEST_FRIEND_BY_USERNAME = gql`
  mutation RequestFriendByUsername($input: RequestFriendByUsernameInput!) {
    requestFriendByUsername(input: $input) {
      id
      status
      active
      chatId
      requesterId
      receiverId
      createdAt
      updatedAt
    }
  }
`;




export const UPDATE_FRIEND_STATUS = gql`
	mutation UpdateFriendStatus($input: UpdateFriendStatusInput!) {
		updateFriendStatus(input: $input) {
			id
			status
			active
			requesterId
			receiverId
			updatedAt
		}
	}
`;

export const TOGGLE_FRIEND_ACTIVE = gql`
	mutation ToggleFriendActive($input: ToggleFriendActiveInput!) {
		toggleFriendActive(input: $input) {
			id
			active
		}
	}
`;

export const REMOVE_FRIEND = gql`
	mutation RemoveFriend($id: ID!) {
		removeFriend(id: $id)
	}
`;
