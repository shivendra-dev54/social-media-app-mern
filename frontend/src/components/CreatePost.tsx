import { useState } from "react";
import { api } from "../lib/axios";

export default function CreatePost({
  setIsCreatingNew,
}: {
  setIsCreatingNew: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!content && !image) {
      alert("Post must have content or image");
      return;
    }

    const formData = new FormData();
    if (content) formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      await api.post("/api/post", formData);
      setIsCreatingNew(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-dark text-light border-secondary mb-3">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <textarea
            className="form-control bg-dark text-light border-secondary mb-3"
            rows={4}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

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
              onClick={() => setIsCreatingNew(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Posting…" : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
