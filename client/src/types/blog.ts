export interface User {
  id: string
  username: string
  email: string
  createdAt: Date
  updatedAt: Date
  post?: Post[]
  comment?: Comment[]
}

export interface Post {
  id: string
  title: string
  description: string
  content: string
  user: User
  createdAt: string
  updatedAt: string
  comment: string
}

export interface Comment {
  id: string
  content: string
  users: User
  createdAt: string
  updatedAt: string
  posts: Post
}

export interface LoginResponse {
  message: string
  user?: User
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
