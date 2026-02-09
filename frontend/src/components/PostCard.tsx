import { api } from "../lib/axios";
import { useState } from "react";
import { useAuthStore } from "../store/Authstore";
import { Link } from "react-router";
import type { Post } from "../Pages/Feed";

export function PostCard({
  post,
  onDelete,
}: {
  post: Post;
  onDelete?: (id: string) => void;
}) {
  const { user } = useAuthStore();
  const isOwner = user?._id === post.author._id;
  const [isLiked, setIsLiked] = useState(
    user ? post.likes.includes(user._id) : false
  );
  const [likes, setLikes] = useState(post.likes.length);
  const [loading, setLoading] = useState(false);

  const toggleLike = async () => {
    if (!user || loading) return;

    try {
      setLoading(true);
      setIsLiked((prev) => !prev);
      setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
      await api.patch(`/api/post/${post._id}/like`);
    } catch (err) {
      setIsLiked((prev) => !prev);
      setLikes((prev) => (isLiked ? prev + 1 : prev - 1));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async () => {
    if (!confirm("Delete this post?")) return;

    try {
      await api.delete(`/api/post/${post._id}`);
      onDelete?.(post._id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    }
  };

  return (
    <div className="relative bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-5 mb-4 shadow-xl shadow-blue-500/5 hover:border-slate-600/50 transition-all duration-300">
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-blue-500/0 hover:from-blue-500/5 hover:to-transparent rounded-xl transition-all duration-300 pointer-events-none" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold text-lg">
              {post.author.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-semibold text-slate-200">
              {post.author.username}
            </div>
            <small className="text-slate-500 text-sm">
              {new Date(post.createdAt).toLocaleString()}
            </small>
          </div>
        </div>

        {/* Content */}
        {post.content && (
          <p className="text-slate-300 leading-relaxed mb-4">{post.content}</p>
        )}

        {/* Image */}
        {post.image && (
          <img
            src={post.image}
            className="w-full rounded-lg mt-3 border border-slate-700/50"
            alt="post"
          />
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4 text-slate-400">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              isLiked
                ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                : "bg-slate-700/30 text-slate-400 border border-slate-600/30 hover:bg-slate-700/50 hover:text-slate-300"
            }`}
            onClick={toggleLike}
            disabled={loading}
          >
            ♥ {likes}
          </button>

          <Link
            to={`/app/post/${post._id}/comments`}
            className="px-4 py-2 bg-slate-700/30 hover:bg-slate-700/50 text-slate-400 hover:text-slate-300 border border-slate-600/30 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 no-underline"
          >
            💬 {post.commentsCount}
          </Link>

          {isOwner && (
            <div className="ml-auto flex gap-2">
              <Link
                to={`/app/post/${post._id}/edit`}
                className="px-4 py-2 bg-slate-700/30 hover:bg-slate-700/50 text-slate-400 hover:text-slate-300 border border-slate-600/30 rounded-lg transition-all duration-300 no-underline"
              >
                ✏️
              </Link>
              <button
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50 rounded-lg transition-all duration-300"
                onClick={deletePost}
              >
                🗑
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}