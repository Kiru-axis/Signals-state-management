export interface IUser {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  gender: string;
  country: string;
  role: string;
  receiveNewsletters: boolean;
  token?: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  mobile: string;
  gender: string;
  country: string;
  role: string;
  receiveNewsletters: boolean;
}
