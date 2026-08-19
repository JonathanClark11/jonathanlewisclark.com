import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost, getAllPosts } from "@/lib/writing";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Jonathan Lewis Clark`,
    description: post.description,
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen grain topo-pattern">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/90 backdrop-blur-md border-b border-border-subtle">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-accent-copper tracking-wide"
          >
            JLC
          </Link>
          <Link
            href="/writing"
            className="text-text-secondary hover:text-accent-copper transition-colors text-sm"
          >
            ← Writing
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <header className="mb-12">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-accent-copper-dim border border-border-subtle px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="font-[family-name:var(--font-cormorant)] text-4xl sm:text-5xl font-light text-text-primary leading-tight mb-6">
            {post.title}
          </h1>
          <div className="flex items-center gap-4">
            <time className="text-text-muted text-sm font-light">
              {formatDate(post.date)}
            </time>
            {post.guideUrl && (
              <>
                <span className="text-border-subtle text-sm">·</span>
                <a
                  href={post.guideUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-copper text-sm hover:text-accent-copper-light transition-colors"
                >
                  Setup Guide ↗
                </a>
              </>
            )}
          </div>
        </header>

        <div
          className="prose-writing"
          dangerouslySetInnerHTML={{ __html: post.content! }}
        />
      </article>
    </main>
  );
}
