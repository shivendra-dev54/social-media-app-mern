import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { api } from "../lib/axios";
import { useAuthStore } from "../store/Authstore";
import { PostCard } from "../components/PostCard";
import toast from "react-hot-toast";

interface Post {
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

export default function Profile() {
  const { user, setUser, logout } = useAuthStore();
  const navigate = useNavigate();

  // Loading states
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  
  // Data states
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  
  // UI states
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    fullname: "",
    bio: "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // 1. Fetch the latest User Profile from backend
        // (This fills in details like avatar, bio, fullname that might be missing from login)
        const userRes = await api.get("/api/user");
        const freshUserData = userRes.data.data;

        // 2. Update Global Store
        setUser(freshUserData);

        // 3. Update Local Form State
        setFormData({ 
            fullname: freshUserData.fullname, 
            bio: freshUserData.bio || "" 
        });
        setAvatarPreview(freshUserData.avatar || null);

        // 4. Fetch Posts
        const postsRes = await api.get("/api/post");
        const allPosts: Post[] = postsRes.data.data;
        
        // Filter posts belonging to this user
        // We use freshUserData._id to ensure we have the ID even if store was empty initially
        const userPosts = allPosts.filter((p) => p.author._id === freshUserData._id);
        setMyPosts(userPosts);

      } catch (err) {
        console.error("Error loading profile:", err);
        // If 401 Unauthorized, token is likely invalid
        toast.error("Session expired. Please login again.");
        await logout();
        navigate("/login");
      } finally {
        setIsLoadingProfile(false);
        setLoadingPosts(false);
      }
    };

    loadProfileData();
  }, [setUser, logout, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const data = new FormData();
      data.append("fullname", formData.fullname);
      data.append("bio", formData.bio);

      if (fileInputRef.current?.files?.[0]) {
        data.append("avatar", fileInputRef.current.files[0]);
      }

      const res = await api.patch("/api/user", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update store and local view with response
      const updatedUser = res.data.data;
      setUser(updatedUser);
      setAvatarPreview(updatedUser.avatar || null);
      
      toast.success("Profile updated!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePost = (id: string) => {
    setMyPosts((prev) => prev.filter((post) => post._id !== id));
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This will delete all your posts and data permanently.")) return;

    try {
      await api.delete("/api/user");
      await logout();
      navigate("/");
      toast.success("Account deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Could not delete account.");
    }
  };

  // Show a full page loader while we fetch the initial user data
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <svg className="animate-spin h-10 w-10" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  // Safety check (should be handled by the catch block above, but good for Typescript)
  if (!user) return null;

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 py-6 text-slate-100 select-none">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-125 h-125 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-125 h-125 bg-indigo-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 max-w-2xl">

        {/* --- Profile Header Card --- */}
        <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 mb-8 shadow-xl overflow-hidden">
          {/* Decorative Top Banner */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-r from-blue-600/20 to-indigo-600/20" />

          <div className="relative mt-8 flex flex-col md:flex-row items-end md:items-start gap-6">

            {/* Avatar Section */}
            <div className="relative group shrink-0">
              <div className="w-32 h-32 rounded-full border-4 border-slate-900 overflow-hidden bg-slate-800 shadow-2xl">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl bg-linear-to-br from-slate-700 to-slate-800 text-slate-400">
                    {user.fullname?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-4 border-transparent"
                >
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            {/* User Info / Edit Form */}
            <div className="flex-1 w-full">
              <div className="flex justify-between items-start mb-2">
                <div className="w-full">
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={formData.fullname}
                        onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                        className="w-full bg-slate-800/50 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Full Name"
                      />
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full bg-slate-800/50 border border-slate-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                        placeholder="Write a short bio..."
                        rows={2}
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold text-white">{user.fullname}</h1>
                      <p className="text-blue-400">@{user.username}</p>
                      <p className="text-slate-300 mt-3 leading-relaxed">
                        {user.bio || "No bio yet."}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        // Reset form to current store values
                        setAvatarPreview(user.avatar || null);
                        setFormData({ fullname: user.fullname!, bio: user.bio || "" });
                      }}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 md:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 text-white rounded-lg text-sm font-medium transition-all"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex-1 md:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 text-slate-300 rounded-lg text-sm font-medium transition-all"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-700/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{myPosts.length}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{user.followers?.length || 0}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{user.following?.length || 0}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">Following</div>
            </div>
          </div>
        </div>

        {/* --- User Content --- */}
        <h3 className="text-xl font-semibold text-slate-200 mb-4 px-2">Your Posts</h3>

        {loadingPosts ? (
          <div className="text-center text-slate-400 py-12">
            <svg className="animate-spin h-8 w-8 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : myPosts.length > 0 ? (
          <div className="space-y-4">
            {myPosts.map((post) => (
              <PostCard key={post._id} post={post} onDelete={handleDeletePost} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-900/30 rounded-xl border border-dashed border-slate-700">
            <p className="text-slate-500">You haven't posted anything yet.</p>
          </div>
        )}

        {/* --- Danger Zone --- */}
        <div className="mt-16 pt-8 border-t border-slate-800">
          <h3 className="text-red-500 font-semibold mb-2">Danger Zone</h3>
          <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
            <span className="text-slate-400 text-sm">
              Permanently delete your account and all content.
            </span>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-medium rounded-lg border border-red-500/20 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}