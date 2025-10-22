export interface LoginResponse {
  login: {
    accessToken: string;
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
