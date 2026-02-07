import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { api } from "../lib/axios";
import type { Post } from "./Feed";

export default function UpdatePost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get("/api/post");
        const post = res.data.data.find((p: Post) => p._id === id);

        if (!post) {
          alert("Post not found");
          navigate("/app");
          return;
        }

        setContent(post.content || "");
        setExistingImage(post.image || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!content && !image && !existingImage) {
      alert("Post must have content or image");
      return;
    }

    const formData = new FormData();
    if (content) formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      await api.patch(`/api/post/${id}`, formData);
      navigate("/app");
    } catch (err) {
      console.error(err);
      alert("Failed to update post");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-secondary mt-5">
        Loading…
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card bg-dark text-light border-secondary">
            <div className="card-body">
              <h5 className="mb-3">Edit Post</h5>

              <form onSubmit={handleSubmit}>
                <textarea
                  className="form-control bg-dark text-light border-secondary mb-3"
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />

                {existingImage && (
                  <img
                    src={existingImage}
                    className="img-fluid rounded mb-3"
                    alt="existing"
                  />
                )}

                <input
                  type="file"
                  className="form-control form-control-sm bg-dark text-light border-secondary mb-3"
                  accept="image/*"
                  onChange={(e) =>
                    setImage(e.target.files ? e.target.files[0] : null)
                  }
                />

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/app")}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="btn btn-primary">
                    Update
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
