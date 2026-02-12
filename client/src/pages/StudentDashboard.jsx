import React from 'react';
import '../styles/StudentDashboard.css'

const StudentDashboard = () => {
  // Get data from localStorage
  const portfolio = JSON.parse(localStorage.getItem('portfolio_data'));

  if (!portfolio) {
    return <div className="error-state">No portfolio data found. Please complete your registration.</div>;
  }

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar/Navigation could go here */}
      
      <main className="dashboard-content">
        {/* Header Section */}
        <section className="profile-header-card">
          <div className="profile-info">
            <h1>{portfolio.header.name}</h1>
            <p className="subtitle">{portfolio.header.dept} • Year {portfolio.header.year} • Sem {portfolio.header.sem}</p>
            <div className="contact-bar">
              <span>📧 {portfolio.header.email}</span>
              <span>📞 {portfolio.header.phone_no}</span>
            </div>
            <div className="link-badges">
              <a href={portfolio.header.git_link} target="_blank" rel="noreferrer" className="link-tag">GitHub</a>
              <a href={portfolio.header.linkedin_link} target="_blank" rel="noreferrer" className="link-tag">LinkedIn</a>
              <a href={portfolio.header.leetcode_link} target="_blank" rel="noreferrer" className="link-tag">LeetCode</a>
            </div>
          </div>
        </section>

        <div className="dashboard-grid">
          {/* Objective */}
          <div className="grid-card full-width">
            <h3>Career Objective</h3>
            <p className="objective-text">{portfolio.objective}</p>
          </div>

          {/* Academic Stats */}
          <div className="grid-card">
            <h3>Academic Performance</h3>
            <div className="stats-container">
              <div className="stat-box highlight">
                <span>CGPA</span>
                <p>{portfolio.academic.cgpa}</p>
              </div>
              <div className="stat-box">
                <span>10th %</span>
                <p>{portfolio.academic.tenth_percentage}%</p>
              </div>
              <div className="stat-box">
                <span>12th %</span>
                <p>{portfolio.academic.twelfth_percentage}%</p>
              </div>
            </div>
            <h4>Semester Wise (SGPA)</h4>
            <div className="sgpa-chips">
              {portfolio.academic.sgpas.map((sgpa, index) => (
                <span key={index} className="sgpa-chip">S{index + 1}: {sgpa}</span>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="grid-card">
            <h3>Technical Skills</h3>
            <div className="skill-tags">
              {portfolio.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="grid-card full-width">
            <h3>Projects</h3>
            <div className="projects-list">
              {portfolio.projects.map((project, index) => (
                <div key={index} className="project-card">
                  <h4>{project.title}</h4>
                  <div className="tech-stack">
                    {project.tech_stack.map((tech, i) => <span key={i}>#{tech}</span>)}
                  </div>
                  <p>{project.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements & Certs */}
          <div className="grid-card">
            <h3>Achievements & Certifications</h3>
            <ul className="list-items">
              {portfolio.achievements.map((item, i) => <li key={i}>{item}</li>)}
              {portfolio.certifications.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>

          {/* Hobbies */}
          <div className="grid-card">
            <h3>Hobbies</h3>
            <div className="hobby-tags">
              {portfolio.hobbies.map((hobby, i) => <span key={i} className="hobby-tag">{hobby}</span>)}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;