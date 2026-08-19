import Link from "next/link";
import { getAllPosts } from "@/lib/writing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing — Jonathan Lewis Clark",
  description:
    "Thoughts on engineering leadership, AI, distributed systems, and building products.",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function WritingPage() {
  const posts = getAllPosts();

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
            href="/"
            className="text-text-secondary hover:text-accent-copper transition-colors text-sm"
          >
            ← Back
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <div className="mb-16">
          <p className="text-accent-copper text-sm tracking-[0.3em] uppercase mb-4 font-light">
            Writing
          </p>
          <h1 className="font-[family-name:var(--font-cormorant)] text-4xl sm:text-5xl font-light text-text-primary">
            Notes & Articles
          </h1>
          <p className="mt-4 text-text-secondary font-light leading-relaxed">
            Thoughts on engineering leadership, AI, distributed systems, and
            building things.
          </p>
        </div>

        <div className="space-y-0">
          {posts.map((post, i) => (
            <article
              key={post.slug}
              className={`py-10 ${i < posts.length - 1 ? "border-b border-border-subtle" : ""}`}
            >
              <Link href={`/writing/${post.slug}`} className="group block">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-light text-text-primary group-hover:text-accent-copper transition-colors leading-snug mb-3">
                      {post.title}
                    </h2>
                    <p className="text-text-secondary text-sm font-light leading-relaxed mb-4">
                      {post.description}
                    </p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
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
                  </div>
                  <time className="text-text-muted text-sm font-light shrink-0 pt-1">
                    {formatDate(post.date)}
                  </time>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
