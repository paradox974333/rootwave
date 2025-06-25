import { Header } from "@/components/header";
import { Footer } from "@/components/footer"; // Assuming you have this from previous example
import { BookOpen, CalendarDays, Clock } from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";
import { getAllPostsMeta, PostMetaWithSlug } from '@/lib/blog-loader'; // Use the new loader

// Metadata for the blog listing page
export const metadata = {
  title: "Rootwave Blog | Insights on Sustainability & Innovation",
  description: "Explore articles from Rootwave on sustainable practices, eco-friendly innovations, and our journey towards a greener future.",
};

export default async function BlogIndexPage() {
  const posts: PostMetaWithSlug[] = await getAllPostsMeta();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-stone-100 flex flex-col antialiased">
      <Header />

      <main className="flex-grow">
        <section className="relative py-20 sm:py-28 md:py-32 text-center px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-blue-500/10"></div>
          <div className="container mx-auto relative z-10">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 bg-emerald-100/70 text-emerald-700 rounded-full text-sm font-medium border border-emerald-200/80">
              <BookOpen className="w-4 h-4 mr-2" />
              Our Thoughts
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-5 tracking-tight text-gray-800">
              Rootwave <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500">Blog</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-normal leading-relaxed">
              Sharing our journey, insights, and passion for a sustainable future.
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 relative z-20">
          <div className="container mx-auto">
            {posts.length === 0 ? (
              <p className="text-center text-gray-600 text-xl">No blog posts yet. Check back soon!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Link href={`/blogs/${post.slug}`} key={post.slug} legacyBehavior passHref>
                    <a className="block bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                      {post.image && (
                        <div className="relative w-full h-48 sm:h-56">
                          <NextImage
                            src={post.image}
                            alt={`Cover image for ${post.title}`}
                            layout="fill"
                            objectFit="cover"
                            className="group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {post.description}
                        </p>
                        <div className="flex flex-wrap items-center text-xs text-gray-500 space-x-3">
                          <div className="flex items-center">
                            <CalendarDays className="w-3.5 h-3.5 mr-1 text-gray-400" />
                            <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                            <span>{post.readTimeMinutes} min read</span>
                          </div>
                        </div>
                        {post.tags && post.tags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}