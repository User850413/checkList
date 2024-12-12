export interface User {
  username: string;
  createdAt: Date;
  updatedAt: Date;
  profileUrl: string;
}

export interface UserResponse {
  users: User[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface UserInput {
  username: string;
  email: string;
  password: string;
}
