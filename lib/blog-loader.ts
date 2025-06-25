import fs from 'fs';
import path from 'path';

// Interface for the metadata exported by each blog post file
export interface BlogPostFileMeta {
  title: string;
  date: string;
  author: string;
  readTimeMinutes: number;
  image?: string;
  tags?: string[];
  description: string;
  keywords?: string;
}

// Interface for the module structure of each blog post file
export interface BlogPostModule {
  default: React.ComponentType<any>; // The content component
  meta: BlogPostFileMeta;
}

// Combined metadata with slug
export interface PostMetaWithSlug extends BlogPostFileMeta {
  slug: string;
}

const postsDirectory = path.join(process.cwd(), 'app/blogs/posts');

// Function to get metadata for all posts
export async function getAllPostsMeta(): Promise<PostMetaWithSlug[]> {
  if (!fs.existsSync(postsDirectory)) {
    console.warn("Posts directory not found:", postsDirectory);
    return [];
  }
  const filenames = fs.readdirSync(postsDirectory).filter(file => file.endsWith('.tsx'));

  const postsPromises = filenames.map(async (filename) => {
    const slug = filename.replace(/\.tsx$/, '');
    try {
      // Dynamically import the module. Assumes '@' alias is configured for project root.
      const postModule: BlogPostModule = await import(`@/app/blogs/posts/${slug}`);
      if (postModule && postModule.meta) {
        return {
          slug,
          ...postModule.meta,
        };
      }
      console.warn(`Metadata not found or module invalid for ${filename}`);
      return null;
    } catch (error) {
      console.error(`Failed to load metadata for ${filename}:`, error);
      return null;
    }
  });

  const posts = (await Promise.all(postsPromises))
    .filter((post): post is PostMetaWithSlug => post !== null);

  // Sort posts by date, newest first
  return posts.sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1));
}

// Function to get a single post's module (content + meta) by slug
export async function getPostModuleBySlug(slug: string): Promise<BlogPostModule | null> {
  const filePath = path.join(postsDirectory, `${slug}.tsx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    const postModule: BlogPostModule = await import(`@/app/blogs/posts/${slug}`);
    if (postModule && postModule.default && postModule.meta) {
      return postModule;
    }
    console.warn(`Default export or metadata missing in ${slug}.tsx`);
    return null;
  } catch (error) {
    console.error(`Failed to load post module for slug ${slug}:`, error);
    return null;
  }
}

// Function to get all post slugs (for generateStaticParams)
export function getAllPostSlugs(): { slug: string }[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  const filenames = fs.readdirSync(postsDirectory).filter(file => file.endsWith('.tsx'));
  return filenames.map(filename => ({
    slug: filename.replace(/\.tsx$/, ''),
  }));
}