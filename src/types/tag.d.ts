export interface Tag {
  _id: string;
  name: string;
  userId: string;
  interest: string;
  completedRate: number;
  isCompleted: boolean;
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
}

export interface UserTagDetail {
  tagId: string;
  isCompleted: boolean;
  _id: string;
}

export interface UserTag {
  _id: string;
  userId: string;
  tags: UserTagDetail[];
}

export interface SharedTag {
  _id: string;
  name: string;
  interest: string;
  list: string[];
}
