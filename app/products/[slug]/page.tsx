
// app/[slug]/page.tsx
import { fetchProduct } from "./fetchProduct";
import ProductDetailsPage from "./ProductDetailsPage";
import { Metadata } from "next";
import { notFound } from 'next/navigation';

type Props = {
  params: { slug: string };
  searchParams: { lang: string };
};

// ✅ Build-time static paths
export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);

  const data = await res.json();
  console.log('generateStaticParams - fetched data:', data); // Check shape here

  return Array.isArray(data)
    ? data.map((product: any) => ({ slug: product.slug }))
    : [];
}


// ✅ Awaiting async `params` and `searchParams`
export async function generateMetadata(props: Promise<Props>): Promise<Metadata> {
  const { params, searchParams } = await props;
  const lang = searchParams.lang || "en";

  const product = await fetchProduct(params.slug, lang);

  if (!product || !product.name) return notFound();

  const ogImageUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products/og?title=${encodeURIComponent(product.name)}`;
  const image = product.mainImage || ogImageUrl;
  const baseUrl = `https://16zips.com/products/${product.slug}`;

  return {
    title: product.seoTitle || `${product.name} | 16Zips`,
    description: product.seoDescription || product.description?.slice(0, 160),
    keywords: product.seoKeywords || `${product.name}, fitness, ${product.category || ""}`,
    openGraph: {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.description?.slice(0, 160),
      images: [image],
      url: baseUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.description?.slice(0, 160),
      images: [image],
    },
    alternates: {
      canonical: baseUrl,
      languages: {
        'en': `${baseUrl}?lang=en`,
        'fr': `${baseUrl}?lang=fr`,
        'es': `${baseUrl}?lang=es`,
        'it': `${baseUrl}?lang=it`,
      },
    },
  };
}


export const revalidate = 60;


export default async function Page(props: Promise<Props>) {
  const { params, searchParams } = await props;
  
  const product = await fetchProduct(params.slug, searchParams.lang || "en");

  if (!product) {
    notFound();
  }

  return <ProductDetailsPage product={product} />;
}
