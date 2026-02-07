import { Link } from "react-router";

const Feature = ({ title, desc }: { title: string; desc: string }) => (
  <div className="col-12 col-md-5">
    <div className="card bg-dark border-secondary h-100 shadow-sm">
      <div className="card-body p-4">
        <h6 className="card-title text-uppercase text-primary fw-semibold mb-2">
          {title}
        </h6>
        <p className="card-text text-secondary mb-0">
          {desc}
        </p>
      </div>
    </div>
  </div>
);

const StackCard = ({
  title,
  items,
}: {
  title: string;
  items: string[];
}) => (
  <div className="col-12 col-md-6">
    <div className="card bg-dark border-secondary h-100 shadow-sm">
      <div className="card-body p-4">
        <h5 className="card-title text-primary fw-semibold mb-3">
          {title}
        </h5>
        <ul className="list-unstyled text-secondary mb-0">
          {items.map((item) => (
            <li key={item} className="mb-1">
              <span className="me-2">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export const Homepage = () => {
  return (
    <main
      className="text-light py-5"
      data-bs-theme="dark"
    >
      {/* Hero */}
      <section className="container text-center mb-5">
        <h1 className="display-4 fw-semibold text-primary mb-3">
          SocialFlow
        </h1>

        <p className="fs-5 text-secondary mb-4">
          A minimal, developer-first social media platform
        </p>

        <p
          className="mx-auto text-secondary"
          style={{ maxWidth: 720 }}
        >
          SocialFlow is a clean, developer-focused social media application
          built with predictable state, strong typing, and scalable backend
          architecture. It prioritizes performance, security, and long-term
          maintainability over flashy features.
        </p>

        {/* CTA */}
        <div className="mt-4">
          <Link
            to="/signup"
            className="btn btn-primary btn-lg px-4"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mb-5">
        <div className="row justify-content-center g-4">
          <Feature
            title="Performance"
            desc="Optimized APIs, CDN-backed media delivery, and minimal overfetching."
          />
          <Feature
            title="Authentication"
            desc="Secure JWT-based authentication with httpOnly cookies."
          />
        </div>
      </section>

      {/* Tech Stack */}
      <section
        className="container mb-5"
        style={{ maxWidth: 900 }}
      >
        <h2 className="fs-3 fw-semibold text-primary mb-4 text-center text-md-start">
          Tech Stack
        </h2>

        <div className="row g-4">
          <StackCard
            title="Backend"
            items={[
              "Node.js / Bun",
              "MongoDB + Mongoose",
              "JWT (JOSE)",
              "Cloudinary",
            ]}
          />
          <StackCard
            title="Frontend"
            items={[
              "React",
              "Bootstrap (Dark)",
              "React Router",
              "Zustand",
              "React Hot Toast",
            ]}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="container text-center pt-4 border-top border-secondary">
        <p className="text-secondary mb-1">
          Created by{" "}
          <span className="fw-semibold text-primary">
            Shivendra Devadhe
          </span>
        </p>

        <p className="fs-5 text-warning fw-bold mb-0">
          ^_^
        </p>
      </footer>
    </main>
  );
};
