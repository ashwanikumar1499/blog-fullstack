import { create } from "zustand";
import { Blog, CreateBlogInput } from "../types/blog";
import api from "../lib/api";

interface BlogState {
  blogs: Blog[];
  currentBlog: Blog | null;
  isLoading: boolean;
  fetchBlogs: () => Promise<void>;
  fetchBlog: (id: string) => Promise<void>;
  createBlog: (input: CreateBlogInput) => Promise<void>;
}

export const useBlogStore = create<BlogState>((set) => ({
  blogs: [],
  currentBlog: null,
  isLoading: false,
  fetchBlogs: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/blog/bulk");
      set({ blogs: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  fetchBlog: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/blog/${id}`);
      set({ currentBlog: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  createBlog: async (input) => {
    set({ isLoading: true });
    try {
      await api.post("/blog", input);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
