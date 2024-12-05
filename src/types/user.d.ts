export interface User {
  username: string;
  createdAt: Date;
  updatedAt: Date;
  profileUrl: string;
}

export interface UserInput {
  username: string;
  email: string;
  password: string;
}
