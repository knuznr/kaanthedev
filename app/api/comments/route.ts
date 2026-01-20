import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const commentsFile = join(process.cwd(), 'public', 'data', 'comments.json');

interface Comment {
  id: string;
  slug: string;
  author: string;
  authorImage?: string;
  content: string;
  createdAt: string;
  approved: boolean;
}

// GET comments for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter required' },
        { status: 400 }
      );
    }

    try {
      const data = await readFile(commentsFile, 'utf-8');
      const comments: Comment[] = JSON.parse(data);
      const postComments = comments.filter(
        (c) => c.slug === slug && c.approved
      );
      return NextResponse.json(postComments);
    } catch {
      return NextResponse.json([]);
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, author, content, authorImage } = body;

    if (!slug || !author || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const comment: Comment = {
      id: `${Date.now()}`,
      slug,
      author,
      authorImage,
      content,
      createdAt: new Date().toISOString(),
      approved: false, // Moderasyon için önce approved: false
    };

    try {
      const data = await readFile(commentsFile, 'utf-8');
      const comments: Comment[] = JSON.parse(data);
      comments.push(comment);
      await writeFile(commentsFile, JSON.stringify(comments, null, 2));
    } catch {
      await writeFile(commentsFile, JSON.stringify([comment], null, 2));
    }

    return NextResponse.json(
      { message: 'Comment submitted for review', comment },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to post comment' },
      { status: 500 }
    );
  }
}
