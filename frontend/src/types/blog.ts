export interface Blog {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface CreateBlogInput {
  title: string;
  content: string;
}