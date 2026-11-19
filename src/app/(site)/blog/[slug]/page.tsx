import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Article } from "@/components/site/blog-page";
import { POSTS, getPost } from "@/content/blog";
import { unsplash } from "@/content/images";
import { config } from "@/lib/config";
import { getLandingData } from "@/lib/landing";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt, openGraph: { title: post.title, description: post.excerpt, type: "article", images: [unsplash(post.cover)] } };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const { services } = await getLandingData();
  const serviceId = post.service ? services.find((s) => s.slug === post.service!.slug)?.id : undefined;
  const related = [...POSTS.filter((p) => p.slug !== post.slug && p.category === post.category), ...POSTS.filter((p) => p.slug !== post.slug && p.category !== post.category)].slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    image: unsplash(post.cover),
    author: { "@type": "Organization", name: "Cara Sanctuary" },
    mainEntityOfPage: `${config.APP_URL}/blog/${post.slug}`,
  };
  return (
    <>
      <Article post={post} related={related} serviceId={serviceId} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
