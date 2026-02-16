import { Link, useNavigate } from "react-router";
import { Feature } from "../components/Feature";
import { StackCard } from "../components/StackCard";
import '../styles/homepageStyles.css';
import { useAuthStore } from "../store/Authstore";
import { useEffect } from "react";
import { api } from "../lib/axios";

export const Homepage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {

    const getServerHealth = async () => {
      try {
        await api.get("/api/health");
      } catch (err) {
        console.error(err);
      }
    };

    getServerHealth();

    if (user?._id) {
      navigate("/app");
    }
  });

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative">
        <section className="container mx-auto px-6 py-20 md:py-32 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8 animate-fadeIn">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              <span className="text-sm text-blue-300 font-medium">Developer-First Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-linear-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent animate-fadeInUp">
              SocialFlow
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-6 font-light animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              A minimal, developer-first social media platform
            </p>

            <p className="max-w-2xl mx-auto text-slate-400 leading-relaxed mb-10 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              SocialFlow is a clean, developer-focused social media application
              built with predictable state, strong typing, and scalable backend
              architecture. It prioritizes performance, security, and long-term
              maintainability over flashy features.
            </p>

            <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95"
              >
                Get Started
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-linear-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
              Key Features
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Feature
                title="Performance"
                desc="Optimized APIs, CDN-backed media delivery, and minimal overfetching ensure lightning-fast load times and smooth user experience."
              />
              <Feature
                title="Authentication"
                desc="Enterprise-grade security with JWT-based authentication using httpOnly cookies to protect user data and sessions."
              />
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 bg-linear-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
              Tech Stack
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <StackCard
                title="Backend"
                items={[
                  "Node.js",
                  "MongoDB + Mongoose",
                  "JWT (JOSE)",
                  "Cloudinary",
                ]}
              />
              <StackCard
                title="Frontend"
                items={[
                  "React",
                  "Tailwind CSS",
                  "React Router",
                  "Zustand",
                  "React Hot Toast",
                ]}
              />
            </div>
          </div>
        </section>

        <footer className="container mx-auto px-6 py-12 mt-20 border-t border-slate-800">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-slate-400 mb-2">
              Created by{" "}
              <span className="font-semibold bg-linear-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                Shivendra Devadhe
              </span>
            </p>
            <p className="text-2xl text-blue-400 font-bold animate-bounce">
              ^_^
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
};