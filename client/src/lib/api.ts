import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const blogApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post("/auth/login", credentials),

  register: (userData: { username: string; email: string; password: string }) =>
    api.post("/register", userData),

  logout: () => api.get("/auth/logout"),

  checkAuth: () => api.get("/auth/me"),

  // getPosts: (page = 1, limit = 10) => api.get(`/posts?page=${page}&limit=${limit}`),

  getPosts: () => api.get(`/posts`),

  getPost: (id: string) => api.get(`/posts/${id}`),

  createPost: (postData: {
    title: string;
    content: string;
    description: string;
    userId: number;
  }) => api.post("/posts", postData),

  createComment: (commentData: {
    content: string;
    userId: number;
    postId: number;
  }) => api.post("/comments", commentData),

  updatePost: (
    id: string,
    postData: Partial<{ title: string; content: string; description: string }>,
  ) => api.put(`/posts/${id}`, postData),

  deletePost: (id: string) => api.delete(`/posts/${id}`),

  deleteComment: (id: number) => api.delete(`/comments/${id}`),
};
