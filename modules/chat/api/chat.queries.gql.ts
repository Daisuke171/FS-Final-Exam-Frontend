import { gql } from "@apollo/client";

// ------------ Mensajes ------------ // 

export const GET_MESSAGES = gql`
	query Messages($chatId: ID!) {
		messages(chatId: $chatId) {
			id
			chatId
			senderId
			message
			status
			read
			timestamp
		}
	}
`;



