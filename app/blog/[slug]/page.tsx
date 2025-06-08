// app/blog/page.tsx

// app/blog/[slug]/page.tsx
import { getBlogPost } from './fetchBlog';
import BlogDetails from './BlogDetails';
import { Metadata } from 'next';

type Props = {
  params: { slug: string };
  searchParams: { lang?: string };
};

// ✅ Build-time static paths
export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog`);

  const data = await res.json();
  console.log('generateStaticParams - fetched data:', data); // Check shape here

  return Array.isArray(data)
    ? data.map((post: any) => ({ slug: post.slug }))
    : [];
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const lang = searchParams.lang || 'en'; 
  const post = await getBlogPost(params.slug, lang);

  if (!post) return {};

  const translated = post.translations?.[lang];
  const title = translated?.metaTitle || post.metaTitle || post.title;
  const description =
    translated?.metaDescription || post.metaDescription || post.title;
  const imageUrl = post.imageUrl;
  const ogImageUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/blog/og?title=${encodeURIComponent(title)}`;
  const image = imageUrl || ogImageUrl; // hybrid method here
  const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}/blog/${params.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: fullUrl,
      images: [{ url: image }], // ✅ use either DB image or generated image
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image], // ✅ same here
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL!),
  };
}


export default async function Page({
  params,
  searchParams,
}: Props) {
  const lang = searchParams.lang || 'en';
  const post = await getBlogPost(params.slug, lang);

  // If the post doesn't exist, render a "Not Found" page or similar fallback
  if (!post) return <div>Post not found</div>;

  return <BlogDetails post={post} />;
}