import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { api } from "../lib/axios";
import { useAuthStore } from "../store/Authstore";
import { PostCard } from "../components/PostCard";
import type { Post } from "./Feed";

interface Comment {
  _id: string;
  post: string;
  author: {
    _id: string;
    username: string;
  };
  content: string;
  likes: string[];
  createdAt: string;
}

export default function PostCommentsPage() {
  const { postId } = useParams();
  const { user } = useAuthStore();

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState<Post>();

  // fetch post
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get(`/api/post/${postId}`);
        setPost(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [postId]);

  // 🔹 Create comment
  const createComment = useCallback(async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const res = await api.post(`/api/post/${postId}/comment`, {
        content: newComment,
      });

      setComments((prev) => [res.data.data, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error(err);
      alert("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  }, [newComment, postId]);

  // 🔹 Update comment
  const updateComment = async (commentId: string, content: string) => {
    try {
      const res = await api.patch(`/api/comment/${commentId}`, { content });
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? res.data.data : c))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update comment");
    }
  };

  // 🔹 Delete comment
  const deleteComment = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;

    try {
      await api.delete(`/api/comment/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete comment");
    }
  };

  // 🔹 Toggle like
  const toggleLike = async (comment: Comment) => {
    if (!user) return;

    const isLiked = comment.likes.includes(user._id);

    // optimistic update
    setComments((prev) =>
      prev.map((c) =>
        c._id === comment._id
          ? {
              ...c,
              likes: isLiked
                ? c.likes.filter((id) => id !== user._id)
                : [...c.likes, user._id],
            }
          : c
      )
    );

    try {
      await api.patch(`/api/comment/${comment._id}/like`);
    } catch (err) {
      // rollback
      setComments((prev) =>
        prev.map((c) =>
          c._id === comment._id
            ? {
                ...c,
                likes: isLiked
                  ? [...c.likes, user._id]
                  : c.likes.filter((id) => id !== user._id),
              }
            : c
        )
      );
      console.error(err);
    }
  };

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/api/post/${postId}/comments`);
        setComments(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId, createComment]);

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 py-6">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Post */}
        {post && (
          <div className="mb-6">
            <PostCard key={post._id} post={post} onDelete={undefined} />
          </div>
        )}

        {/* Create comment */}
        {user && (
          <div className="relative bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 mb-6 shadow-xl shadow-blue-500/5">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-blue-500/0 hover:from-blue-500/5 hover:to-transparent rounded-xl transition-all duration-300 pointer-events-none" />
            <div className="relative">
              <textarea
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 resize-none"
                rows={2}
                placeholder="Write a comment…"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className="flex justify-end mt-3">
                <button
                  className="px-5 py-2 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-medium rounded-lg shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  onClick={createComment}
                  disabled={submitting}
                >
                  {submitting ? "Posting…" : "Comment"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Comments list */}
        {loading && (
          <div className="text-center text-slate-400 py-8">
            <svg className="animate-spin h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading comments…
          </div>
        )}

        {!loading && comments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-500 text-lg mb-2">💬</div>
            <p className="text-slate-400">No comments yet. Be the first to comment!</p>
          </div>
        )}

        {!loading &&
          comments.map((comment) => {
            const isOwner = user?._id === comment.author._id;
            const isLiked = user ? comment.likes.includes(user._id) : false;

            return (
              <div
                key={comment._id}
                className="relative bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 mb-3 shadow-xl shadow-blue-500/5 hover:border-slate-600/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-blue-500/0 hover:from-blue-500/5 hover:to-transparent rounded-xl transition-all duration-300 pointer-events-none" />
                
                <div className="relative">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {comment.author.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <strong className="text-slate-200 font-semibold">
                          {comment.author.username}
                        </strong>
                        <div className="text-xs text-slate-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-slate-300 leading-relaxed mb-4">
                    {comment.content}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                        isLiked
                          ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                          : "bg-slate-700/30 text-slate-400 border border-slate-600/30 hover:bg-slate-700/50 hover:text-slate-300"
                      }`}
                      onClick={() => toggleLike(comment)}
                    >
                      ♥ {comment.likes.length}
                    </button>

                    {isOwner && (
                      <>
                        <button
                          className="px-3 py-1.5 bg-slate-700/30 hover:bg-slate-700/50 text-slate-400 hover:text-slate-300 border border-slate-600/30 rounded-lg transition-all duration-300"
                          onClick={() => {
                            const updated = prompt(
                              "Edit comment",
                              comment.content
                            );
                            if (updated) updateComment(comment._id, updated);
                          }}
                        >
                          ✏️
                        </button>

                        <button
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50 rounded-lg transition-all duration-300"
                          onClick={() => deleteComment(comment._id)}
                        >
                          🗑
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}