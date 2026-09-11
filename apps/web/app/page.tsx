const features = [
  {
    title: "Courses",
    description: "Keep classes, deadlines, materials, and study activity organized.",
  },
  {
    title: "Study Intelligence",
    description: "Turn upcoming work into a clear, prioritized study plan.",
  },
  {
    title: "AI grounded in your material",
    description: "Ask questions against your own notes and course documents.",
  },
];

export default function Home() {
  return (
    <main>
      <nav className="nav">
        <strong>CampusMind</strong>
        <span className="badge">Engineering Preview</span>
      </nav>

      <section className="hero">
        <p className="eyebrow">YOUR ACADEMIC COMMAND CENTER</p>
        <h1>One system for classes, deadlines, studying, and AI.</h1>
        <p className="subhead">
          CampusMind is being built to give students a single place to organize
          academic work and get intelligent help grounded in their own material.
        </p>
        <div className="actions">
          <button>Join the future beta</button>
          <a href="/dashboard">Explore the product</a>
        </div>
      </section>

      <section className="dashboard-preview">
        <div>
          <span>Today</span>
          <h2>Good morning.</h2>
          <p>You have 3 important items coming up.</p>
        </div>
        <div className="priority-card">
          <small>TOP PRIORITY</small>
          <strong>Operating Systems — Process Scheduling</strong>
          <span>Due tomorrow · High priority</span>
        </div>
      </section>

      <section id="features" className="features">
        {features.map((feature) => (
          <article key={feature.title}>
            <span className="dot" />
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
