'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPost {
  slug: string;
  title: string;
  imageUrl: string;
  createdAt: string;
}

export default function BlogPost() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/blog?category=home&limit=3');
        if (!res.ok) throw new Error('Failed to fetch recent blog posts');
        const response = await res.json();

        if (Array.isArray(response.data)) {
          setPosts(
            response.data.map((post: any) => ({
              slug: post.slug,
              title: post.title,
              imageUrl: post.imageUrl,
              createdAt: new Date(post.createdAt).toISOString(),
            }))
          );
        } else {
          throw new Error('Unexpected API response format');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-gray-600 animate-pulse">Loading posts...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500 font-medium">Error: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-10 mt-7">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Latest in Cannabis Wellness</h2>
        <Link href="/blog" className="text-green-600 hover:text-green-800 flex items-center space-x-1">
          <span className="text-lg font-medium">View All Articles</span>
          <span>&gt;</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.slug}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
            >
              <Image
                src={post.imageUrl}
                alt={post.title}
                width={500}
                height={300}
                unoptimized
                className="w-full h-56 object-cover"
              />
              
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-3">{post.title}</h3>
                <Link href={`/blog/${post.slug}`} className="inline-block mt-4">
                  <span className="inline-block bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">
                    Read More
                  </span>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No blog posts available</p>
        )}
      </div>
    </div>
  );
}
