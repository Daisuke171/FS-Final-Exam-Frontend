import { gql } from "@apollo/client";

// === GraphQL (coinciden con tus firmas del resolver) ===
export const START_CALL = gql`
  mutation StartCall($calleeId: ID!, $sdpOffer: String!) {
    startCall(calleeId: $calleeId, sdpOffer: $sdpOffer) {
      id
      callerId
      calleeId
      status
      sdpOffer
    }
  }
`;
export const ANSWER_CALL = gql`
  mutation AnswerCall($callId: ID!, $sdpAnswer: String!) {
    answerCall(callId: $callId, sdpAnswer: $sdpAnswer) {
      id
      status
      sdpAnswer
    }
  }
`;
export const REJECT_CALL = gql`
  mutation RejectCall($callId: ID!) {
    rejectCall(callId: $callId) {
      id
      status
    }
  }
`;
export const END_CALL = gql`
  mutation EndCall($callId: ID!) {
    endCall(callId: $callId) {
      id
      status
    }
  }
`;

