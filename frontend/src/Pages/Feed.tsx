import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { PostCard } from "../components/PostCard";
import CreatePost from "../components/CreatePost";

export interface Post {
  _id: string;
  author: {
    _id: string;
    username: string;
  };
  content?: string;
  image?: string;
  likes: string[];
  commentsCount: number;
  createdAt: string;
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/api/post");
        setPosts(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [isCreatingNew]);

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((post) => post._id !== id));
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 py-6">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 max-w-2xl">
        {/* Create post entry */}
        {isCreatingNew ? (
          <CreatePost setIsCreatingNew={setIsCreatingNew} />
        ) : (
          <div
            className="relative bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 mb-6 shadow-xl shadow-blue-500/5 cursor-pointer hover:border-blue-500/30 transition-all duration-300 group"
            onClick={() => setIsCreatingNew(true)}
          >
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-transparent rounded-xl transition-all duration-300" />
            
            <div className="relative flex gap-3 items-center">
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-lg">+</span>
              </div>
              <div className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-500 group-hover:border-blue-500/30 transition-all duration-300">
                What's on your mind?
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="text-center text-slate-400 py-12">
            <svg className="animate-spin h-10 w-10 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading feed…
          </div>
        )}

        {/* Empty state */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No posts yet</h3>
            <p className="text-slate-500">Be the first to share something!</p>
          </div>
        )}

        {/* Posts */}
        {!loading &&
          posts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={handleDelete} />
          ))}
      </div>
    </div>
  );
}