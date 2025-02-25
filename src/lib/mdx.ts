import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

const NOTES_DIR = path.join(process.cwd(), 'src/content/notes')

export interface NoteFrontmatter {
    title: string
    date: string
    tags: string[]
    summary?: string
}

export interface NoteData {
    slug: string
    frontmatter: NoteFrontmatter
}

export interface NoteContent extends NoteData {
    content: string
}

export async function getAllNotes(): Promise<NoteData[]> {
    const filenames = await fs.readdir(NOTES_DIR)

    const notes = await Promise.all(
        filenames
            .filter(filename => /\.mdx?$/.test(filename))
            .map(async filename => {
                const filePath = path.join(NOTES_DIR, filename)
                const fileContents = await fs.readFile(filePath, 'utf8')
                const { data } = matter(fileContents)

                return {
                    slug: filename.replace(/\.mdx?$/, ''),
                    frontmatter: {
                        title: data.title || '未命名',
                        date: data.date || new Date().toISOString(),
                        tags: data.tags || [],
                        summary: data.summary
                    }
                }
            })
    )

    return notes.sort((a, b) =>
        new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    )
}

export async function getNoteData(slug: string): Promise<NoteContent> {
    const extensions = ['.mdx', '.md']
    let fileContents: string | null = null

    for (const ext of extensions) {
        try {
            fileContents = await fs.readFile(
                path.join(NOTES_DIR, `${slug}${ext}`),
                'utf8'
            )
            break
        } catch (err) {
            continue
        }
    }

    if (!fileContents) {
        throw new Error(`笔记 ${slug} 未找到`)
    }

    const { data, content } = matter(fileContents)

    return {
        slug,
        frontmatter: {
            title: data.title || '未命名',
            date: data.date || new Date().toISOString(),
            tags: data.tags || [],
            summary: data.summary
        },
        content
    }
}

export type Note = NoteData; 