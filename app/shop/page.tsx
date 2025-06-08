import { Metadata } from 'next';
import ShopPage from './ShopPage';

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { category?: string };
}): Promise<Metadata> {
  const slug = searchParams?.category;

  if (!slug) {
    return {
      title: 'Shop',
      description: 'Browse all our categories and products.',
    };
  }

  const formattedCategory = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/category?slug=${slug}`
    );
    const result = await res.json();

    if (res.ok && result?.data) {
      const category = result.data;

      return {
        title: category.metaTitle || `${formattedCategory} | Shop`,
        description:
          category.metaDescription ||
          `Browse our ${formattedCategory} and Cannabis products.`,
        openGraph: {
          title: category.metaTitle || `${formattedCategory} | Shop`,
          description:
            category.metaDescription ||
            `Browse our ${formattedCategory} and Cannabis products.`,
          images: [category.imageUrl],
        },
      };
    }

    return {
      title: `${formattedCategory} | Shop`,
      description: `Browse our ${formattedCategory} and Cannabis products.`,
    };
  } catch (error) {
    console.error('SEO fetch error:', error);
    return {
      title: 'Shop',
      description: 'Browse all our categories and products.',
    };
  }
}

export default function Page({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  return <ShopPage category={searchParams?.category} />;
}
