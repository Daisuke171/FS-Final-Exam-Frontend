import { gql} from "@apollo/client";

// ------------ Mensajes ------------

export const MESSAGE_ADDED = gql`
	subscription MessageAdded($chatId: ID!) {
		messageAdded(chatId: $chatId) {
			chatId
			id
			message
			read
			senderId
			status
			timestamp
		}
	}
`;

export const MESSAGE_UPDATED = gql`
	subscription MessageUpdated($chatId: ID!) {
		messageUpdated(chatId: $chatId) {
			chatId
			id
			message
			read
			senderId
			status
			timestamp
		}
	}
`;


// ------------ LLamadas ------------


export const CALL_RINGING = gql`
	subscription CallRinging($calleeId: ID!) {
		callRinging(calleeId: $calleeId) {
			calleeId
			callerId
			createdAt
			id
			sdpAnswer
			sdpOffer
			status
			updatedAt
		}
	}
`;

export const CALL_ANSWERED = gql`
	subscription CallAnswered($calleeId: ID!) {
		callAnswered(calleeId: $calleeId) {
			calleeId
			callerId
			createdAt
			id
			sdpAnswer
			sdpOffer
			status
			updatedAt
		}
	}
`;

export const CALL_ENDED = gql`
	subscription CallEnded($calleeId: ID!) {
		callEnded(calleeId: $calleeId) {
			calleeId
			callerId
			createdAt
			id
			sdpAnswer
			sdpOffer
			status
			updatedAt
		}
	}
`;

export const CALL_REJECTED = gql`
	subscription CallRejected($calleeId: ID!) {
		callRejected(calleeId: $calleeId) {
			calleeId
			callerId
			createdAt
			id
			sdpAnswer
			sdpOffer
			status
			updatedAt
		}
	}
`;

export const CALL_CANCELLED = gql`
	subscription CallCancelled($calleeId: ID!) {
		callCancelled(calleeId: $calleeId) {
			calleeId
			callerId
			createdAt
			id
			sdpAnswer
			sdpOffer
			status
			updatedAt
		}
	}
`;