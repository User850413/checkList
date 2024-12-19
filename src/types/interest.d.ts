export interface interest {
  _id: string;
  name: string;
}

export interface interestResponse {
  data: interest[];
  limit: number;
  page: number;
  total: number;
}
