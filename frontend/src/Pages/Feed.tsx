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
    <div className="container py-3">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">

          {/* Create post entry */}
          {isCreatingNew ? (
            <CreatePost setIsCreatingNew={setIsCreatingNew} />
          ) : (
            <div
              className="card bg-dark text-light border-secondary mb-3"
              onClick={() => setIsCreatingNew(true)}
              style={{ cursor: "pointer" }}
            >
              <div className="card-body d-flex gap-3">
                <div
                  className="rounded-circle bg-secondary"
                  style={{ width: 45, height: 40 }}
                />
                <div className="form-control bg-dark text-secondary border-secondary">
                  What's on your mind?
                </div>
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
