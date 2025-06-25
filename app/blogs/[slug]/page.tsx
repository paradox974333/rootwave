import { Header } from "@/components/header";
import { Footer } from "@/components/footer"; // Assuming you have this
import { CalendarDays, Clock, UserCircle } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';

import { getPostModuleBySlug, getAllPostSlugs, BlogPostModule } from '@/lib/blog-loader'; // Use the new loader

type Props = {
  params: { slug: string };
};

// Generate metadata dynamically for SEO
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata // Not strictly used here but good practice to include
): Promise<Metadata> {
  const postModule = await getPostModuleBySlug(params.slug);

  if (!postModule) {
    return {
      title: "Blog Post Not Found",
      description: "The blog post you are looking for does not exist.",
    };
  }

  const meta = postModule.meta;
  // Ensure NEXT_PUBLIC_SITE_URL is set in your .env.local for absolute URLs in production
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const imageUrl = meta.image ? (meta.image.startsWith('http') ? meta.image : `${siteUrl}${meta.image}`) : undefined;


  return {
    title: `${meta.title} | Rootwave Blog`,
    description: meta.description,
    keywords: meta.keywords || meta.tags?.join(', '),
    authors: [{ name: meta.author }],
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${siteUrl}/blogs/${params.slug}`,
      siteName: 'Rootwave Blog',
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: meta.title }] : [],
      locale: 'en_US',
      type: 'article',
      publishedTime: meta.date,
      authors: [meta.author],
      tags: meta.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: imageUrl ? [imageUrl] : [],
    }
  };
}

// Generate static paths at build time
export async function generateStaticParams() {
  return getAllPostSlugs();
}

export default async function BlogPostPage({ params }: Props) {
  const postModule = await getPostModuleBySlug(params.slug);

  if (!postModule) {
    notFound(); // Triggers the 404 page if post not found
  }

  const PostContentComponent = postModule.default; // This is your blog content component
  const meta = postModule.meta;

  const displayDate = new Date(meta.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-stone-100 flex flex-col antialiased">
      <Header />

      <main className="flex-grow py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-8 text-sm text-gray-500">
            <Link href="/blogs" className="hover:text-emerald-600">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">{meta.title}</span>
          </div>
        </div>
        <div className="container mx-auto max-w-3xl bg-white rounded-xl shadow-xl p-6 sm:p-8 md:p-12 border border-gray-200/80">
          <article className="prose prose-lg lg:prose-xl max-w-none prose-emerald
                              prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-gray-800
                              prose-p:text-gray-700 prose-li:text-gray-700
                              prose-a:text-emerald-600 hover:prose-a:text-emerald-700
                              prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50/70 prose-blockquote:text-emerald-800
                              prose-figure:my-8 prose-img:rounded-lg prose-img:shadow-md">
            <header className="mb-10 border-b border-gray-200 pb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 !leading-tight">
                {meta.title}
              </h1>
              <div className="flex flex-wrap items-center text-sm text-gray-500 space-x-4 sm:space-x-6">
                <div className="flex items-center">
                  <CalendarDays className="w-4 h-4 mr-1.5 text-gray-400" />
                  <span>{displayDate}</span>
                </div>
                <div className="flex items-center">
                  <UserCircle className="w-4 h-4 mr-1.5 text-gray-400" />
                  <span>By {meta.author}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                  <span>{meta.readTimeMinutes} min read</span>
                </div>
              </div>
              {meta.tags && meta.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  {meta.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full hover:bg-gray-200 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {meta.image && (
              <figure className="!my-8">
                <NextImage
                  src={meta.image}
                  alt={`Cover image for ${meta.title}`}
                  width={1200} // Adjust as per your common image dimensions
                  height={675} // Adjust for aspect ratio
                  className="w-full h-auto rounded-xl shadow-lg"
                  priority // Good for LCP
                />
              </figure>
            )}

            <div className="mt-8">
              <PostContentComponent /> {/* Render the actual blog content here */}
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}