export type LoginResponse = LoginSuccess | LoginError;

export interface LoginSuccess {
  success: true;
  token: string;
  expires_at: Date;
}

export interface LoginError {
  success: false;
}
