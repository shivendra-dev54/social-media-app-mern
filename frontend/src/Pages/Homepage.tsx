import { Link } from "react-router";

const Feature = ({ title, desc }: { title: string; desc: string }) => (
  <div className="col-md-5">
    <div className="card bg-dark border-secondary h-100">
      <div className="card-body">
        <h6 className="card-title text-uppercase text-primary fw-semibold">
          {title}
        </h6>
        <p className="card-text text-secondary">
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
  <div className="col-md-6">
    <div className="card bg-dark border-secondary h-100">
      <div className="card-body">
        <h5 className="card-title text-primary fw-semibold mb-3">
          {title}
        </h5>
        <ul className="list-unstyled text-secondary mb-0">
          {items.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);


export const Homepage = () => {
  return (
    <main
      className="container-fluid py-5 text-center"
      data-bs-theme="dark"
    >
      <h1 className="mb-3 display-4 fw-semibold text-primary">
        SocialFlow
      </h1>

      <p className="mb-2 fs-5 text-secondary">
        A minimal social media platform
      </p>

      <p className="mx-auto mb-5 fs-5 text-secondary">
        SocialFlow is a clean, developer-focused social media application built
        with predictable state, strong typing, and scalable backend design.
        It focuses on performance, security, and long-term maintainability.
      </p>

      {/* CTA */}
      <div className="mb-5">
        <Link to="/signin" className="btn btn-primary btn-lg">
          Sign In
        </Link>
      </div>

      {/* Features */}
      <div className="row justify-content-center g-4 mb-5">
        <Feature title="Performance" desc="Optimized API, CDN-backed media" />
        <Feature title="Authentication" desc="JWT + refresh tokens (httpOnly)" />
      </div>

      {/* Tech Stack */}
      <section className="mx-auto text-start" style={{ maxWidth: 900 }}>
        <h2 className="mb-4 fs-3 fw-semibold text-primary">
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

      <p className="mt-5 text-secondary">
        Created by{" "}
        <span className="fw-semibold text-primary">
          Shivendra Devadhe
        </span>
      </p>

      <p className="fs-4 text-warning fw-bold">^_^</p>
    </main>
  );
};
