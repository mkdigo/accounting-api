export type UserAuthenticationInputDTO = {
  username: string;
  password: string;
};

export type UserAuthenticationOutputDTO = {
  token: {
    id: string;
    content: string;
  };
  refreshToken: {
    id: string;
    content: string;
  };
};
