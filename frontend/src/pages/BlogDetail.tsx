import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useBlogStore } from '../store/blog';
import { Button } from '../components/ui/Button';
import { formatDate } from '../lib/utils';

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentBlog, isLoading, fetchBlog } = useBlogStore();

  useEffect(() => {
    if (id) {
      fetchBlog(id);
    }
  }, [id, fetchBlog]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Blog post not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="outline"
          className="mb-8"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <article className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {currentBlog.title}
          </h1>
          
          <div className="flex items-center text-sm text-gray-500 mb-8">
            <span>By {currentBlog.author.name}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(currentBlog.createdAt)}</span>
          </div>

          <div className="prose prose-blue max-w-none">
            {currentBlog.content}
          </div>
        </article>
      </div>
    </div>
  );
}