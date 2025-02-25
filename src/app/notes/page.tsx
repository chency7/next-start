import { getAllNotes, type Note } from '@/lib/mdx';
import Link from 'next/link';

export default async function NotesPage() {
  const notes = await getAllNotes();
  
  // 预先解析所有 slug
  const resolvedNotes = await Promise.all(
    notes.map(async (note) => ({
      ...note,
      resolvedSlug: await note.slug
    }))
  );

  return (
    <div className="space-y-8">
      {resolvedNotes.map((note) => (
        <article
          key={note.slug}
          className="rounded-lg border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800"
        >
          <Link
            href={`/notes/${note.slug}`}
            className="block hover:text-blue-600 dark:hover:text-blue-400"
          >
            <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {note.frontmatter.title}
            </h2>
            <div className="mb-4 text-zinc-600 dark:text-zinc-400">
              <time suppressHydrationWarning>
                {note.frontmatter.date ? new Date(note.frontmatter.date).toLocaleDateString('zh-CN') : ''}
              </time>
              {note.frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="ml-2 rounded bg-zinc-100 px-2 py-1 text-sm text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200"
                >
                  {tag}
                </span>
              ))}
            </div>
            {note.frontmatter.summary && (
              <p className="text-zinc-700 dark:text-zinc-300">{note.frontmatter.summary}</p>
            )}
          </Link>
        </article>
      ))}
    </div>
  );
}
