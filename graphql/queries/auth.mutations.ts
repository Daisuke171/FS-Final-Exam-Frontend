import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      accessToken
      user {
        id
        username
        email
        name
        nickname
        level {
          id
          atomicNumber
          name
          experienceRequired
        }
        skins {
          id
          skin {
            name
            img
          }
          active
        }
      }
    }
  }
`;
