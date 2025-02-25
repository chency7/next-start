import { getAllNotes, getNoteData } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { CustomMDXComponents } from '@/components/mdx';
import { Suspense } from 'react';

export async function generateStaticParams() {
  const notes = await getAllNotes();
  return notes.map((note) => ({
    slug: note.slug,
  }));
}

async function NoteHeader({ slug }: { slug: string }) {
  const { frontmatter } = await getNoteData(slug);

  return (
    <header className="not-prose mb-8 transform transition-all duration-500 ease-in-out hover:scale-[1.02]">
      <h1 className="bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:from-zinc-100 dark:to-zinc-400">
        {frontmatter.title}
      </h1>
      <div className="mt-4 flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
        <time className="flex items-center gap-1 text-sm">
          <span className="inline-block h-1 w-1 rounded-full bg-zinc-400 dark:bg-zinc-500"></span>
          {new Date(frontmatter.date).toLocaleDateString('zh-CN')}
        </time>
        <div className="flex flex-wrap gap-2">
          {frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}

async function NoteBody({ slug }: { slug: string }) {
  const { content } = await getNoteData(slug);

  return (
    <div className="note-content prose prose-zinc max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-a:text-pink-500 hover:prose-a:text-pink-600 prose-img:rounded-xl prose-img:shadow-lg dark:prose-a:text-pink-400 dark:hover:prose-a:text-pink-300">
      <MDXRemote source={content} components={CustomMDXComponents} />
    </div>
  );
}

interface NotePageProps {
  params: {
    slug: string;
  };
}

const NotePage = async ({ params }: NotePageProps) => {
  return (
    <>
      <Suspense fallback={<div className="h-8 w-full animate-pulse bg-gray-200" />}>
        <NoteHeader slug={params.slug} />
      </Suspense>

      <Suspense
        fallback={
          <div className="space-y-4">
            <div className="h-4 w-3/4 animate-pulse bg-gray-200" />
            <div className="h-4 w-full animate-pulse bg-gray-200" />
            <div className="h-4 w-5/6 animate-pulse bg-gray-200" />
          </div>
        }
      >
        <NoteBody slug={params.slug} />
      </Suspense>
    </>
  );
};

export default NotePage;
