export interface Tag {
  _id: string;
  name: string;
  userId: string;
  interest: string;
  __v: number;
}

export interface TagRequest {
  name: string;
  interest: string;
}

export interface TagResponse {
  data: Tag[];
  total: number;
  page: number;
  limit: number;
  page: number;
}
