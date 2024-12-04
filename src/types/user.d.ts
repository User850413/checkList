export interface User {
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  profileUrl: string;
}

export interface UserInput {
  username: string;
  email: string;
  password: string;
}
