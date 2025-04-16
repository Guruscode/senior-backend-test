export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IChangePasswordInput {
  userId: string;
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export interface IForgotPasswordInput {
  email: string;
}

export interface IResetPasswordInput {
  token: string;
  password: string;
  passwordConfirm: string;
}

export interface IAuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token?: string;
}