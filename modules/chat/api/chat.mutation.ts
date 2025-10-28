import { gql } from "@apollo/client";

// ------ Mensajes ------
export const SEND_MESSAGE = gql`
	mutation SendMessage($input: SendMessageInput!) {
		sendMessage(input: $input) {
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
