export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  post?: Post[];
  comment?: Comment[];
}

export interface Post {
  id: number;
  title: string;
  description: string;
  content: string;
  user: User;
  userId?: number;
  createdAt: string;
  updatedAt: string;
  comments: Comment;
}

export interface Comment {
  id: number;
  content: string;
  users: User;
  createdAt: string;
  updatedAt: string;
  posts: Post;
  postId: number;
}

export interface LoginResponse {
  message: string;
  user?: User;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
