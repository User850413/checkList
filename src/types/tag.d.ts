export interface Tag {
  _id: string;
  name: string;
}

export interface TagRequest {
  name: string;
  interest: string;
}

export interface TagResponse {
  tags: Tag[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
