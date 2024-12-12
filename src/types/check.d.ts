export interface Check {
  _id: string;
  task: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  tagId: string;
}

export interface CheckResponse {
  checks: Check[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
