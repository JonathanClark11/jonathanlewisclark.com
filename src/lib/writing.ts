import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const contentDir = path.join(process.cwd(), "src/content/writing");

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags?: string[];
  guideUrl?: string;
  content?: string;
}

export function getAllPosts(): Post[] {
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".md"));
  return files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(contentDir, filename), "utf8");
      const { data } = matter(raw);
      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        description: data.description as string,
        tags: data.tags as string[] | undefined,
        guideUrl: data.guideUrl as string | undefined,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPost(slug: string): Promise<Post | null> {
  const filepath = path.join(contentDir, `${slug}.md`);
  if (!fs.existsSync(filepath)) return null;
  const raw = fs.readFileSync(filepath, "utf8");
  const { data, content } = matter(raw);
  const processed = await remark().use(remarkHtml).process(content);
  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    description: data.description as string,
    tags: data.tags as string[] | undefined,
    guideUrl: data.guideUrl as string | undefined,
    content: processed.toString(),
  };
}
