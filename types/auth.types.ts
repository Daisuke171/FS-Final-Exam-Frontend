export interface LoginResponse {
  login: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      name: string;
      username: string;
      nickname: string;
      email: string;
      level: {
        id: string;
        atomicNumber: number;
        name: string;
      };
      skins?: {
        id: string;
        active: boolean;
        skin: {
          name: string;
          img: string;
        };
      }[];
    };
  };
}

export interface LoginInput {
  usernameOrEmail: string;
  password: string;
}

export interface RefreshTokenResponse {
  refreshAccessToken: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      name: string;
      lastname: string;
      nickname: string;
      username: string;
      email: string;
      skins?: Array<{
        skin: {
          img: string;
        };
      }>;
    };
  };
}

export interface GoogleAuthResponse {
  googleAuth: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      name: string;
      nickname: string;
      username: string;
      skins?: {
        id: string;
        active: boolean;
        skin: {
          name: string;
          img: string;
        };
      }[];
    };
  };
}
