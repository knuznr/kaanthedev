'use client';

import { useEffect, useState } from 'react';

interface Comment {
  id: string;
  slug: string;
  author: string;
  authorImage?: string;
  content: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
}

export function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  useEffect(() => {
    // Get current user from cookie
    const userCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('user='));
    if (userCookie) {
      try {
        const rawValue = userCookie.slice('user='.length);
        const userData = JSON.parse(decodeURIComponent(rawValue));
        setUser(userData);
      } catch {
        setUser(null);
      }
    }

    // Fetch comments
    fetchComments();
  }, [slug]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?slug=${slug}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Lütfen yorum yapmadan önce giriş yapınız');
      return;
    }

    if (!newComment.trim()) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          author: user.name || user.login,
          authorImage: user.avatar_url,
          content: newComment,
        }),
      });

      if (response.ok) {
        setNewComment('');
        setSubmitMessage('Your comment was submitted and will appear after moderation.');
        await fetchComments();
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
      alert('Yorum gönderilemedi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string | number) => {

    if (!user) {
      alert('Lütfen yorum silmeden önce giriş yapınız');
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchComments();
      }
    } catch (error) {
      throw new Error(error.error || 'Failed to delete comment');
    }
  };

  return (
    <section className="mt-12">
      {/* Section heading */}
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            comments
          </h2>

          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            share your thoughts about this post.
          </p>
        </div>

        {!loading && (
          <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </span>
        )}
      </div>

      {/* Comment form */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        {user ? (
          <form onSubmit={handleSubmitComment}>
            {/* Current user */}
            <div className="flex items-center gap-3 border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name || user.login}
                  className="h-10 w-10 rounded-full object-cover ring-1 ring-neutral-200 dark:ring-neutral-700"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 text-sm font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                  {(user.name || user.login).charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {user.name || user.login}
                </p>

                <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                  @{user.login}
                </p>
              </div>

              <span className="ml-auto hidden text-xs text-neutral-400 sm:block dark:text-neutral-500">
                commenting with GitHub
              </span>
            </div>

            {/* Textarea */}
            <div className="p-5">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                maxLength={1000}
                className="min-h-32 w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm leading-6 text-neutral-900 outline-none transition placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-400 focus:bg-white focus:ring-4 focus:ring-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:hover:border-neutral-700 dark:focus:border-neutral-600 dark:focus:bg-neutral-900 dark:focus:ring-neutral-800/60"
              />

              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                  <span>be respectful and keep it relevant.</span>

                  <span className="hidden text-neutral-300 sm:inline dark:text-neutral-700">
                    •
                  </span>

                  <span className="tabular-nums">
                    {newComment.length}/1000
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 text-sm font-medium text-white transition hover:bg-neutral-700 focus:outline-none focus:ring-4 focus:ring-neutral-200 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white dark:focus:ring-neutral-800"
                >
                  {submitting && (
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="opacity-25"
                      />

                      <path
                        fill="currentColor"
                        d="M21 12a9 9 0 0 0-9-9v3a6 6 0 0 1 6 6h3Z"
                        className="opacity-75"
                      />
                    </svg>
                  )}

                  {submitting ? 'Posting...' : 'Post comment'}
                </button>
              </div>

              {submitMessage && (
                <div
                  role="status"
                  onAnimationEnd={() => setSubmitMessage(null)}
                  className="animate-toast mt-4 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0"
                  >
                    <path d="m5 12 4 4L19 6" />
                  </svg>

                  <span>{submitMessage}</span>
                </div>
              )}
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-black">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-6 w-6 fill-current"
              >
                <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.24c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.39.97.1-.75.4-1.27.74-1.56-2.57-.29-5.27-1.29-5.27-5.72 0-1.26.45-2.3 1.2-3.11-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.17 1.19A11 11 0 0 1 12 6.05c.98 0 1.96.13 2.88.39 2.2-1.5 3.17-1.19 3.17-1.19.63 1.59.23 2.77.11 3.06.74.81 1.2 1.85 1.2 3.11 0 4.44-2.71 5.42-5.29 5.71.42.36.79 1.07.79 2.16v3.26c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .7Z" />
              </svg>
            </div>

            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              join the discussion
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500 dark:text-neutral-400">
              sign in with your GitHub account to leave a comment.
            </p>

            <button
              type="button"
              onClick={() => {
                const returnTo =
                  window.location.pathname + window.location.search;

                window.location.href =
                  `/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
              }}
              className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 text-sm font-medium text-white transition hover:bg-neutral-700 focus:outline-none focus:ring-4 focus:ring-neutral-200 dark:bg-white dark:text-black dark:hover:bg-neutral-200 dark:focus:ring-neutral-800"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4 fill-current"
              >
                <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.24c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.39.97.1-.75.4-1.27.74-1.56-2.57-.29-5.27-1.29-5.27-5.72 0-1.26.45-2.3 1.2-3.11-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.17 1.19A11 11 0 0 1 12 6.05c.98 0 1.96.13 2.88.39 2.2-1.5 3.17-1.19 3.17-1.19.63 1.59.23 2.77.11 3.06.74.81 1.2 1.85 1.2 3.11 0 4.44-2.71 5.42-5.29 5.71.42.36.79 1.07.79 2.16v3.26c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .7Z" />
              </svg>

              continue with GitHub
            </button>
          </div>
        )}
      </div>

      {/* Comments list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950"
            >
              <div className="flex gap-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-800" />

                <div className="flex-1">
                  <div className="h-4 w-32 rounded bg-neutral-200 dark:bg-neutral-800" />
                  <div className="mt-3 h-3 w-full rounded bg-neutral-100 dark:bg-neutral-900" />
                  <div className="mt-2 h-3 w-3/4 rounded bg-neutral-100 dark:bg-neutral-900" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center dark:border-neutral-700 dark:bg-neutral-900/40">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
              className="h-5 w-5"
            >
              <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
            </svg>
          </div>


          <h3 className="mt-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            no comments yet
          </h3>

          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            be the first person to join the discussion.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const canDelete =
              !!user &&
              comment.author === (user.name || user.login);

            return (
              <article
                key={comment.id}
                className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700"
              >
                <div className="flex items-start gap-3">
                  {comment.authorImage ? (
                    <img
                      src={comment.authorImage}
                      alt={comment.author}
                      className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-neutral-200 dark:ring-neutral-700"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-sm font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                      {comment.author.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          {comment.author}
                        </p>

                        {comment.author && (
                          <p className="mt-0.5 truncate text-xs text-neutral-500 dark:text-neutral-400">
                            @{comment.author}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <time
                          dateTime={comment.createdAt}
                          className="text-xs text-neutral-400 dark:text-neutral-500"
                        >
                          {new Date(comment.createdAt).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </time>

                        {canDelete && (
                          <button
                            type="button"
                            title="Delete comment"
                            aria-label="Delete comment"
                            onClick={() => handleDeleteComment(comment.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 opacity-100 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200 sm:opacity-0 sm:group-hover:opacity-100 dark:text-neutral-500 dark:hover:bg-red-950/40 dark:hover:text-red-400 dark:focus:ring-red-950"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                              className="h-4 w-4"
                            >
                              <path d="M3 6h18" />
                              <path d="M8 6V4h8v2" />
                              <path d="m19 6-1 14H6L5 6" />
                              <path d="M10 11v5" />
                              <path d="M14 11v5" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-neutral-700 dark:text-neutral-300">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
