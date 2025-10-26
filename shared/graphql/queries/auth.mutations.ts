import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      accessToken
      refreshToken
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

export const REGISTER_MUTATION = gql`
  mutation Register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      id
      email
      username
      nickname
      name
      lastname
      birthday
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshAccessToken($refreshToken: String!) {
    refreshAccessToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
      user {
        id
        name
        lastname
        nickname
        username
        email
        skins {
          skin {
            img
          }
        }
      }
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;
