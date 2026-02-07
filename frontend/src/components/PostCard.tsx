import { api } from "../lib/axios";
import { useState } from "react";
import { useAuthStore } from "../store/Authstore";
import { Link } from "react-router";

export interface Post {
  _id: string;
  author: string;
  content?: string;
  image?: string;
  likes: string[];
  commentsCount: number;
  createdAt: string;
}

export function PostCard({
  post,
  onDelete,
}: {
  post: Post;
  onDelete?: (id: string) => void;
}) {
  const { user } = useAuthStore();

  const isOwner = user?._id === post.author;

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
    <div className="card bg-dark text-light mb-3 border-secondary">
      <div className="card-body">

        <div className="d-flex align-items-center mb-2">
          <div
            className="rounded-circle bg-secondary me-2"
            style={{ width: 40, height: 40 }}
          />
          <div>
            <div className="fw-semibold">User</div>
            <small className="text-secondary">
              {new Date(post.createdAt).toLocaleString()}
            </small>
          </div>
        </div>

        {post.content && <p className="card-text">{post.content}</p>}

        {post.image && (
          <img
            src={post.image}
            className="img-fluid rounded mt-2"
            alt="post"
          />
        )}

        <div className="d-flex align-items-center gap-3 mt-3 text-secondary">
          <button
            className={`btn btn-sm ${isLiked ? "btn-danger" : "btn-outline-secondary"
              }`}
            onClick={toggleLike}
            disabled={loading}
          >
            ♥ {likes}
          </button>

          <span>💬 {post.commentsCount}</span>

          {isOwner && (
            <div className="ms-auto d-flex gap-2">
              <Link
                to={`/app/post/${post._id}/edit`}
                className="btn btn-sm btn-outline-secondary"
              >
                ✏️
              </Link>

              <button
                className="btn btn-sm btn-outline-danger"
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
