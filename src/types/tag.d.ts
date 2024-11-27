export interface Tag {
  _id: string;
  name: string;
}

export interface TagResponse {
  tags: Tag[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
