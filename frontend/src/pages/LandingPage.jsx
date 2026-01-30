import React from 'react';
import { Link } from "react-router-dom";
import { ArrowRightIcon, BoltIcon, ChartBarIcon, ClockIcon } from "@heroicons/react/24/outline";

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <nav className="landing-nav">
          <Link to="/" className="logo">
            <span className="logo-icon">FD</span>
            <span>Flash-Decks</span>
          </Link>
          <div className="nav-actions">
            <Link to="/dashboard" className="btn btn-secondary">
              Log in
            </Link>
            <Link to="/dashboard" className="btn btn-primary">
              Sign up
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <span className="hero-badge">
              Spaced repetition done right
            </span>
            <h1 className="hero-title">
              Retain more. Study smarter. Fall in love with learning again.
            </h1>
            <p className="hero-description">
              Flash-Decks combines adaptive scheduling, handcrafted decks, and beautiful analytics to keep you on
              track. Master anything with guided reviews, practice drills, and exam simulations.
            </p>
            <div className="hero-actions">
              <Link to="/dashboard" className="btn btn-primary">
                Start learning free <ArrowRightIcon style={{ width: '1rem', height: '1rem' }} />
              </Link>
              <a href="#features" className="btn btn-secondary">
                Explore the platform <ArrowRightIcon style={{ width: '1rem', height: '1rem' }} />
              </a>
            </div>
            <div className="stats-grid">
              {[
                { label: "Decks", value: "200+" },
                { label: "Active learners", value: "12k" },
                { label: "Avg. retention", value: "93%" },
                { label: "Daily cards reviewed", value: "65k" }
              ].map((stat) => (
                <div key={stat.label} className="stat-card">
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-value">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex relative">
            <div className="card" style={{ width: '100%' }}>
              <div className="space-y-4 p-8">
                <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p className="text-xs" style={{ color: '#64748b' }}>Due today</p>
                    <p className="text-3xl font-bold">32 cards</p>
                  </div>
                  <span className="rounded-full px-4 py-2 text-xs font-semibold" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--brand-600)' }}>
                    +12%
                  </span>
                </div>
                <div className="card" style={{ background: '#f8fafc' }}>
                  <p className="text-sm" style={{ color: '#64748b' }}>Daily streak</p>
                  <p className="text-3xl font-bold">42 days</p>
                  <div className="mt-4" style={{ height: '0.5rem', borderRadius: '9999px', background: '#e2e8f0' }}>
                    <div style={{ height: '0.5rem', borderRadius: '9999px', width: '78%', background: 'linear-gradient(to right, var(--brand-400), var(--brand-600))' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="features-section">
          {[
            {
              icon: BoltIcon,
              title: "Adaptive reviews",
              body: "An SM-2 inspired scheduler keeps the right cards at your fingertips and powers personalized pacing."
            },
            {
              icon: ChartBarIcon,
              title: "Rich analytics",
              body: "Understand your streaks, strengths, and blind spots with dashboards designed to boost motivation."
            },
            {
              icon: ClockIcon,
              title: "Flexible study modes",
              body: "Switch between review, practice, and timed exam prep in seconds and sync across any device."
            }
          ].map((feature) => (
            <div key={feature.title} className="feature-card">
              <feature.icon className="feature-icon" />
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.body}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Flash-Decks. Stay curious.</p>
          <div className="footer-links">
            <Link to="/dashboard">Log in</Link>
            <Link to="/dashboard">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
