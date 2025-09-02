'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

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
              createdAt: new Date(post.createdAt).toLocaleDateString(),
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
      {/* Header */}
      <motion.div
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold">Latest in Cannabis Wellness</h2>
        <Link
          href="/blog"
          className="text-green-600 hover:text-green-800 flex items-center space-x-1"
        >
          <span className="text-lg font-medium">View All Articles</span>
          <span>&gt;</span>
        </Link>
      </motion.div>

      {/* Blog Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.2 },
          },
        }}
      >
        {posts.length > 0 ? (
          posts.map((post) => (
            <motion.div
              key={post.slug}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition cursor-pointer"
            >
              {/* Date badge (always visible now) */}
              <span className="absolute top-3 left-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow z-20">
                {post.createdAt}
              </span>

              {/* Image with overlay effect */}
              <div className="overflow-hidden relative">
                <motion.div whileHover={{ scale: 1.08 }} transition={{ duration: 0.4 }}>
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    width={500}
                    height={300}
                    unoptimized
                    className="w-full h-56 object-cover"
                  />
                </motion.div>
                {/* Gradient overlay on hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
                />
              </div>

              {/* Card content */}
              <div className="p-6 relative z-10">
                <h3 className="text-2xl font-semibold mb-3">{post.title}</h3>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Link href={`/blog/${post.slug}`} className="inline-block mt-4 relative group">
                    <span className="inline-block bg-red-500 text-white px-5 py-2 rounded-lg text-sm font-medium overflow-hidden relative">
                      <motion.span
                        className="absolute inset-0 bg-red-700"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                      <span className="relative">Read More</span>
                    </span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No blog posts available
          </p>
        )}
      </motion.div>
    </div>
  );
}
