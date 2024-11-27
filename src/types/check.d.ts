export interface Check {
  id: string;
  task: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  tag: string;
}

export interface CheckResponse {
  checks: Check[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
