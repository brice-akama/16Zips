'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface BlogPost {
  slug: string;
  title: string;
  imageUrl: string;
  content: string;
  author: string;
  createdAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/blog`);
        if (!res.ok) throw new Error('Failed to fetch blog posts');

        const response = await res.json();

        if (Array.isArray(response.data)) {
          setPosts(
            response.data.map((post: BlogPost) => ({
              slug: post.slug,
              title: post.title,
              content: post.content,
              author: post.author,
              imageUrl: post.imageUrl,
              createdAt: new Date(post.createdAt).toISOString(),
            }))
          );
        } else {
          throw new Error('Unexpected API response format');
        }
      } catch (error: unknown) {
        if (error instanceof Error) setError(error.message);
        else setError('An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const nextPage = () => {
    if (currentPage < Math.ceil(posts.length / postsPerPage)) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600 animate-pulse">Loading blog posts...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500 font-medium">Error: {error}</p>;

  // Framer Motion Variants
  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    hover: { scale: 1.03, transition: { duration: 0.3 } },
  };

  const imageVariants: Variants = {
    hover: { scale: 1.05, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const buttonVariants: Variants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <div className="container mx-auto px-4 py-10 mt-20">
      <div role="heading" aria-level={1} className="text-4xl font-bold text-center mt-10 md:mt-20">
        Latest Blog Posts
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {currentPosts.length > 0 ? (
            currentPosts.map((post: BlogPost) => (
              <motion.div
                key={post.slug}
                className="bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl"
                variants={cardVariants}
                whileHover="hover"
              >
                <motion.div variants={imageVariants}>
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-56 object-cover"
                  />
                </motion.div>
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-3">{post.title}</h2>
                  <Link href={`/blog/${post.slug}`}>
                    <motion.span
                      className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                      variants={buttonVariants}
                      whileHover="hover"
                    >
                      Read More
                    </motion.span>
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">No blog posts available</p>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={prevPage}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={nextPage}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
          disabled={currentPage === Math.ceil(posts.length / postsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
