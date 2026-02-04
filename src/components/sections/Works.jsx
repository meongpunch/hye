import "./Works.css";

const projects = [
  { title: "Dugout", role: "Design + Frontend", year: "2025" },
  { title: "Silla Cards", role: "Landing + Motion", year: "2025" },
  { title: "Studio Brand", role: "Portfolio", year: "2024" },
];

export default function Works() {
  return (
    <div className="works">
      <h2 className="works-title">Work</h2>
      <div className="works-grid">
        {projects.map((project) => (
          <article className="work-card" key={project.title}>
            <h3 className="work-title">{project.title}</h3>
            <p className="work-role">{project.role}</p>
            <span className="work-year">{project.year}</span>
          </article>
        ))}
      </div>
    </div>
  );
}
