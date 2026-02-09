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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImage(file);
    
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

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
      setSubmitting(true);
      await api.patch(`/api/post/${id}`, formData);
      navigate("/app");
    } catch (err) {
      console.error(err);
      alert("Failed to update post");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <svg className="animate-spin h-10 w-10 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 py-8">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative container mx-auto px-4 max-w-2xl">
        <div className="relative bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-2xl shadow-blue-500/10">
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-blue-500/0 hover:from-blue-500/5 hover:to-transparent rounded-xl transition-all duration-300 pointer-events-none" />
          
          <div className="relative">
            {/* Header */}
            <h5 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent mb-6">
              Edit Post
            </h5>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Textarea */}
              <textarea
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 resize-none mb-4"
                rows={4}
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              {/* Existing Image */}
              {existingImage && !previewUrl && (
                <div className="mb-4 relative">
                  <img
                    src={existingImage}
                    className="w-full rounded-lg border border-slate-700/50"
                    alt="existing"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-sm text-slate-300 text-xs rounded-full border border-slate-700/50">
                      Current Image
                    </span>
                  </div>
                </div>
              )}

              {/* New Image Preview */}
              {previewUrl && (
                <div className="mb-4 relative">
                  <img
                    src={previewUrl}
                    className="w-full rounded-lg border border-slate-700/50"
                    alt="Preview"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* File input */}
              <div className="mb-6">
                <label className="block">
                  <div className="px-4 py-2.5 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 rounded-lg text-slate-300 text-sm font-medium cursor-pointer transition-all duration-300 text-center">
                    📷 {image ? image.name : "Change Image"}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-6 py-2.5 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 border border-slate-600/30 rounded-lg font-medium transition-all duration-300 hover:text-slate-200"
                  onClick={() => navigate("/app")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Updating…
                    </span>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}