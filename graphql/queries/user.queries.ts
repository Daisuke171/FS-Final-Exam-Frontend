import { gql } from "@apollo/client";

export const GET_ME = gql`
  query GetMe($userId: ID!) {
    me(userId: $userId) {
      id
      name
      nickname
      email
      avatar
      coins
      experience
      level {
        id
        number
        name
        symbol
        experienceRequired
      }
      nextLevelExperience
      levelProgress
      experienceToNextLevel
    }
  }
`;
