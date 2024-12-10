import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { useBlogStore } from "../store/blog";
import { Button } from "../components/ui/Button";
import { formatDate } from "../lib/utils";
import SignoutButton from "../components/ui/Signout";

export default function BlogList() {
  const { blogs, isLoading, fetchBlogs } = useBlogStore();

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <div className="flex gap-2 items-center">
            <Link to="/blog/create">
              <Button>
                <PlusCircle className="h-5 w-5 mr-2" />
                New Post
              </Button>
            </Link>
            <SignoutButton />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No blog posts yet. Create your first post!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blog/${blog.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.content}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>By {blog.author.name}</span>
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
