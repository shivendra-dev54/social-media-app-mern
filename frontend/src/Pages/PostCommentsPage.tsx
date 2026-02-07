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
    <div className="container py-3">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">

          {post && <PostCard
            key={post._id}
            post={post}
            onDelete={undefined}
          />}

          {/* 🔹 Create comment */}
          {user && (
            <div className="card bg-dark text-light border-secondary mb-3">
              <div className="card-body">
                <textarea
                  className="form-control bg-dark text-light border-secondary mb-2"
                  rows={2}
                  placeholder="Write a comment…"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={createComment}
                    disabled={submitting}
                  >
                    {submitting ? "Posting…" : "Comment"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 🔹 Comments list */}
          {loading && (
            <div className="text-center text-secondary">
              Loading comments…
            </div>
          )}

          {!loading &&
            comments.map((comment) => {
              const isOwner = user?._id === comment.author._id;
              const isLiked = user
                ? comment.likes.includes(user._id)
                : false;

              return (
                <div
                  key={comment._id}
                  className="card bg-dark text-light border-secondary mb-2"
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <strong>{comment.author.username}</strong>
                      <small className="text-secondary">
                        {new Date(comment.createdAt).toLocaleString()}
                      </small>
                    </div>

                    <p className="mt-2">{comment.content}</p>

                    <div className="d-flex align-items-center gap-3 text-secondary">
                      <button
                        className={`btn btn-sm ${isLiked
                          ? "btn-danger"
                          : "btn-outline-secondary"
                          }`}
                        onClick={() => toggleLike(comment)}
                      >
                        ♥ {comment.likes.length}
                      </button>

                      {isOwner && (
                        <>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => {
                              const updated = prompt(
                                "Edit comment",
                                comment.content
                              );
                              if (updated)
                                updateComment(comment._id, updated);
                            }}
                          >
                            ✏️
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
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
    </div>
  );
}
