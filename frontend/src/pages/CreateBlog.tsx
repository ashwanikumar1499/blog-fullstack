import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useBlogStore } from '../store/blog';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';

export default function CreateBlog() {
  const navigate = useNavigate();
  const { createBlog, isLoading } = useBlogStore();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    try {
      await createBlog({ title, content });
      navigate('/');
    } catch (err) {
      setError('Failed to create blog post. Please try again.');
    }
  };

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

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Create New Blog Post
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <Input
              label="Title"
              name="title"
              required
              placeholder="Enter your blog post title"
            />

            <TextArea
              label="Content"
              name="content"
              required
              placeholder="Write your blog post content here..."
              rows={10}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={isLoading}
              >
                Publish Post
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}