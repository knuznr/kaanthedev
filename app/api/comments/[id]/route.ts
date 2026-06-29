import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import type { Comment } from '@/app/types/comment';

const commentsFile = join(
  process.cwd(),
  'public',
  'data',
  'comments.json'
);

type DeleteCommentContext = {
  params: Promise<{ id: string }>;
};

// DELETE for selected comment
export async function DELETE(request: NextRequest, { params }: DeleteCommentContext) {
  try {
    const { id } = await params;
    const rawUser = request.cookies.get('user')?.value;
    if (!rawUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const currentUser = JSON.parse(decodeURIComponent(rawUser));
    if (!id) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      );
    }
    //read -> parse -> DELETE
    const rawComments = await readFile(commentsFile, { encoding: 'utf8' });
    const comments: Comment[] = JSON.parse(rawComments);
    const targetComment = comments.find((comment) => String(comment.id) === id);
    // 404 if couldn't find the comment
    if (!targetComment) {
      return NextResponse.json({ error: "Couldn't find the ID" }, { status: 404 });
    } else {
      const currentAuthor =
        currentUser.name || currentUser.login;
      if (currentAuthor === targetComment.author) {
        const updatedComments = comments.filter((comment) => String(comment.id) !== id);
        await writeFile(commentsFile, JSON.stringify(updatedComments, null, 2));
        return NextResponse.json(
          { message: 'Comment deleted' },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: 'you cannot delete this comment' },
          { status: 403 }
        );
      }
    }
  }
  catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }

};
