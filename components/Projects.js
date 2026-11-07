
"use client";

import { useEffect, useState } from "react";

const GITHUB_USERNAME = "KATARAMNAVYASREE";

const featuredProjects = [
  {
    id: "01",
    letter: "J",
    title: "AI-Powered Job Market Analytics & Skill Forecasting Dashboard",
    category: "AI/ML",
    summary:
      "A platform for job market analytics, role prediction, skill-demand forecasting, and resume analysis.",
    stack: ["Python", "FastAPI", "Random Forest", "ARIMA", "NLP"],
    link: `https://github.com/${GITHUB_USERNAME}/AI-Powered-Job-Market-Analytics-and-Skill-Demand-Forecasting-Dashboard`,
  },
  {
    id: "02",
    letter: "A",
    title: "Air Quality Prediction Using Machine Learning",
    category: "AI/ML",
    summary:
      "A machine learning project using LSTM and ARIMA for air-quality time-series forecasting.",
    stack: ["Python", "LSTM", "ARIMA", "Pandas", "NumPy"],
    link: `https://github.com/${GITHUB_USERNAME}/Air-Quality-Prediction-using-Machine-Learning`,
  },
];

const categories = ["All", "AI/ML"];

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const [githubProjects, setGithubProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchProjects() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error("Unable to fetch GitHub repositories.");
      }

      const repositories = await response.json();

      const featuredNames = featuredProjects.map((project) =>
        project.link.split("/").pop().toLowerCase()
      );

      const otherProjects = repositories
        .filter(
          (repo) =>
            !repo.fork &&
            !featuredNames.includes(repo.name.toLowerCase())
        )
        .map((repo, index) => ({
          id: `github-${repo.id}`,
          letter: repo.name.charAt(0).toUpperCase(),
          title: repo.name.replace(/[-_]/g, " "),
          category: repo.language || "Software Development",
          summary:
            repo.description ||
            "Explore this project on GitHub to learn more.",
          stack: repo.language ? [repo.language] : [],
          link: repo.html_url,
          stars: repo.stargazers_count,
          updated: repo.updated_at,
          isGithub: true,
        }));

      setGithubProjects(otherProjects);
    } catch (err) {
      setError("GitHub projects could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const allProjects = [
    ...featuredProjects,
    ...githubProjects,
  ];

  const visible =
    filter === "All"
      ? allProjects
      : allProjects.filter(
          (project) => project.category === filter
        );

  const availableCategories = [
    "All",
    ...new Set(allProjects.map((project) => project.category)),
  ];

  return (
    <section id="work" className="border-b border-line-soft">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <p className="section-eyebrow">Projects</p>

        <h2 className="mt-3 font-display text-3xl font-semibold text-ivory md:text-4xl">
          What I've built
        </h2>

        <p className="mt-3 max-w-lg text-sm text-muted md:text-base">
          Featured AI/ML projects and automatically updated public
          repositories from GitHub.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {availableCategories.map((category) => {
            const count =
              category === "All"
                ? allProjects.length
                : allProjects.filter(
                    (project) => project.category === category
                  ).length;

            const active = filter === category;

            return (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`focus-ring rounded-full border px-4 py-1.5 font-mono text-xs transition-colors ${
                  active
                    ? "border-amber bg-amber/10 text-amber"
                    : "border-line-soft text-muted hover:border-line hover:text-ivory"
                }`}
              >
                {category} {count}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="font-mono text-xs text-muted">
            {loading
              ? "Loading GitHub projects..."
              : `${allProjects.length} projects`}
          </p>

          <button
            onClick={fetchProjects}
            disabled={loading}
            className="focus-ring rounded border border-line-soft px-3 py-1.5 font-mono text-xs text-amber hover:text-ivory disabled:opacity-50"
          >
            {loading ? "Loading..." : "↻ Refresh"}
          </button>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {visible.map((project) => (
            <article
              key={project.id}
              className="card-hover flex flex-col rounded-lg border border-line-soft bg-surface/50 p-6"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-dim font-mono text-xs font-semibold text-amber">
                  {project.letter}
                </span>

                <span className="rounded border border-line-soft px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-dim">
                  {project.category}
                </span>
              </div>

              <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-ivory">
                {project.title}
              </h3>

              {project.metric && (
                <div className="mt-4 border-l-2 border-mint-dim pl-3">
                  <p className="font-display text-2xl font-semibold text-mint">
                    {project.metric.value}
                  </p>
                  <p className="font-mono text-[11px] text-muted">
                    {project.metric.label}
                  </p>
                </div>
              )}

              <p className="mt-4 text-sm leading-relaxed text-muted">
                {project.summary}
              </p>

              {project.detail && (
                <p className="mt-3 text-sm leading-relaxed text-dim">
                  {project.detail}
                </p>
              )}

              {project.isGithub && (
                <p className="mt-3 font-mono text-xs text-dim">
                  ⭐ {project.stars} stars
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-1.5">
                {project.stack.map((technology) => (
                  <span
                    key={technology}
                    className="rounded bg-surface-hi px-2 py-1 font-mono text-[10px] text-muted"
                  >
                    {technology}
                  </span>
                ))}
              </div>

              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring mt-6 inline-flex items-center gap-1 font-mono text-xs text-amber transition-colors hover:text-ivory"
              >
                View on GitHub →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
