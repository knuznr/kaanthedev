'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Comment {
  id: string;
  slug: string;
  author: string;
  authorImage?: string;
  content: string;
  createdAt: string;
}

interface User {
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

  useEffect(() => {
    // Get current user from cookie
    const userCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('user='));
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie.split('=')[1]);
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
        alert('Yorumunuz gönderildi ve moderasyon bekleniyor');
        fetchComments();
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
      alert('Yorum gönderilemedi');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-12">
      <div className="prose prose-neutral dark:prose-invert max-w-full">
        <h2 className="text-lg font-medium mb-6">Yorumlar</h2>

        {/* Comment Form */}
        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-6 mb-8 border border-neutral-200 dark:border-neutral-800">
          {user ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                {user.avatar_url && (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium text-sm">{user.name || user.login}</p>
                  <form onSubmit={handleSubmitComment}>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Düşüncelerinizi paylaşın..."
                      rows={3}
                      className="w-full mt-2 p-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded text-sm"
                    />
                    <button
                      type="submit"
                      disabled={submitting || !newComment.trim()}
                      className="mt-2 px-4 py-2 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-black rounded text-sm font-medium hover:bg-neutral-700 dark:hover:bg-neutral-300 disabled:opacity-50"
                    >
                      {submitting ? 'Gönderiliyor...' : 'Yorum Gönder'}
                    </button>
                  </form>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                Yorum yapmak için GitHub hesabınızla giriş yapınız
              </p>
              <Link
                href="/api/auth/login"
                className="inline-block px-4 py-2 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-black rounded text-sm font-medium hover:bg-neutral-700 dark:hover:bg-neutral-300"
              >
                GitHub ile Giriş Yap
              </Link>
            </div>
          )}
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Yorumlar yükleniyor...
            </p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Henüz yorum yapılmamış. İlk yorum siz yapın!
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4 border border-neutral-200 dark:border-neutral-800"
              >
                <div className="flex items-start gap-3">
                  {comment.authorImage && (
                    <img
                      src={comment.authorImage}
                      alt={comment.author}
                      className="w-8 h-8 rounded-full mt-1 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm">{comment.author}</p>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 flex-shrink-0">
                        {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-2">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
