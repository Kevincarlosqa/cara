import type { Metadata } from "next";
import { BlogIndex } from "@/components/site/blog-page";
import { POSTS } from "@/content/blog";

export const metadata: Metadata = { title: "Journal", description: "Guías y rituales de belleza: headspa, cuidado de la piel, tratamientos corporales y bienestar, por el equipo de Cara Sanctuary." };

export default function BlogPage() {
  return <BlogIndex posts={[...POSTS].sort((a, b) => b.date.localeCompare(a.date))} />;
}
