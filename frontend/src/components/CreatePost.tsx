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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
    <div className="relative bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-5 mb-6 shadow-xl shadow-blue-500/5">
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-blue-500/0 hover:from-blue-500/5 hover:to-transparent rounded-xl transition-all duration-300 pointer-events-none" />
      
      <div className="relative">
        <form onSubmit={handleSubmit}>
          {/* Textarea */}
          <textarea
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 resize-none"
            rows={4}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* Image preview */}
          {previewUrl && (
            <div className="mt-3 relative">
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
          <div className="mt-3">
            <label className="block">
              <div className="px-4 py-2.5 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 rounded-lg text-slate-300 text-sm font-medium cursor-pointer transition-all duration-300 text-center">
                📷 {image ? image.name : "Add Image"}
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
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              className="px-5 py-2.5 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 border border-slate-600/30 rounded-lg font-medium transition-all duration-300 hover:text-slate-200"
              onClick={() => setIsCreatingNew(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Posting…
                </span>
              ) : (
                "Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}