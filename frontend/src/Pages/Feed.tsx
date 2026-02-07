import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { PostCard } from "../components/PostCard";
import { Link } from "react-router";
import { useAuthStore } from "../store/Authstore";

interface Post {
  _id: string;
  author: string;
  content?: string;
  image?: string;
  likes: string[];
  commentsCount: number;
  createdAt: string;
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

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
  }, []);

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((post) => post._id !== id));
  };

  return (
    <div className="container py-3">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">

          {/* ✅ Create post CTA */}
          {user && (
            <div className="card bg-dark text-light border-secondary mb-3">
              <div className="card-body d-flex gap-3">
                <div
                  className="rounded-circle bg-secondary"
                  style={{ width: 40, height: 40 }}
                />
                <Link
                  to="/app/create"
                  className="form-control bg-dark text-secondary border-secondary text-decoration-none"
                >
                  What’s on your mind?
                </Link>
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center text-secondary">
              Loading feed…
            </div>
          )}

          {!loading &&
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDelete={handleDelete}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
