export interface User {
  username: string;
  createdAt: Date;
  updatedAt: Date;
  profileUrl: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface UserInput {
  username: string;
  email: string;
  password: string;
}

export interface UserDetail {
  bio: string;
  interest: string[];
}
