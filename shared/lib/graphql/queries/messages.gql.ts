import { gql } from "@apollo/client";

export const GET_MESSAGES = gql`
    query Messages($chatId: ID!) {
        messages(chatId: $chatId) {
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