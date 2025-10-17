import { gql } from "@apollo/client";

export const GET_ME = gql`
  query GetMe($userId: ID!) {
    me(userId: $userId) {
      id
      name
      nickname
      email
      coins
      experience
      skins
      level {
        id
        atomicNumber
        name
        chemicalSymbol
        experienceRequired
      }
      nextLevelExperience
      levelProgress
      experienceToNextLevel
      totalScore
    }
  }
`;
