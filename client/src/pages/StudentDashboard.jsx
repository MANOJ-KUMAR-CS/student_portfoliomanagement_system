import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StudentDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  // Get data from localStorage
  const portfolio = JSON.parse(localStorage.getItem('portfolio_data'));
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!portfolio) {
    return (
      <div className="error-state">
        <div className="glass-panel error-card">
          <h2>No portfolio data found</h2>
          <p>Please complete your registration.</p>
          <button className="btn-primary" onClick={() => navigate('/register-portfolio')}>Create Portfolio</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      {/* Navbar */}
      <nav className="glass-panel navbar">
        <div className="logo">Student Portfolio</div>
        <div className="nav-links">
          <span>Welcome, {user?.name || 'Student'}</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      
      <main className="dashboard-content">
        {/* Header Section */}
        <section className="glass-panel profile-header-card">
          <div className="profile-info">
            <div style={{display: 'flex', justifyContent: 'flex-start', marginBottom: '15px'}}>
                 <button className="btn-primary" style={{padding: '6px 12px', fontSize: '0.85rem', width: 'auto'}} onClick={() => navigate('/register-portfolio')}>✎ Edit Profile</button>
            </div>
            
            <div className="header-top" style={{justifyContent: 'flex-start', gap: '20px'}}>
               <div style={{
                   width:'80px', height:'80px', borderRadius:'50%', background:'white', 
                   display:'flex', alignItems:'center', justifyContent:'center', fontSize:'40px',
                   color:'var(--primary)'
               }}>
                  👤
               </div>
               <div>
                  <h1 style={{margin: 0}}>{portfolio.header.name}</h1>
                  <p className="subtitle" style={{margin: '5px 0 0 0'}}>{portfolio.header.dept} • Year {portfolio.header.year} • Sem {portfolio.header.sem}</p>
               </div>
            </div>

            <div className="contact-bar" style={{marginTop: '20px', marginLeft: '100px'}}>
              <span>📧 {portfolio.header.email}</span>
              <span>📞 {portfolio.header.phone_no}</span>
            </div>
            <div className="link-badges" style={{marginLeft: '100px'}}>
              {portfolio.header.git_link && <a href={portfolio.header.git_link} target="_blank" rel="noreferrer" className="link-tag"><span>🐙</span> GitHub</a>}
              {portfolio.header.linkedin_link && <a href={portfolio.header.linkedin_link} target="_blank" rel="noreferrer" className="link-tag"><span>💼</span> LinkedIn</a>}
              {portfolio.header.leetcode_link && <a href={portfolio.header.leetcode_link} target="_blank" rel="noreferrer" className="link-tag"><span>💻</span> LeetCode</a>}
            </div>
          </div>
        </section>

        <div className="dashboard-content-wrapper">
          {/* Row 1: Objective */}
          <div className="dashboard-row">
            <div className="glass-panel grid-card" style={{width: '100%'}}>
              <h3>Career Objective</h3>
              <p className="objective-text">{portfolio.objective}</p>
            </div>
          </div>

          {/* Row 2: Academic & Skills */}
          <div className="dashboard-row">
            <div className="glass-panel grid-card row-half">
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
              <h4 className="header-h4">Semester Wise (SGPA)</h4>
              <div className="sgpa-chips">
                {portfolio.academic.sgpas.map((sgpa, index) => (
                  <span key={index} className="sgpa-chip">S{index + 1}: {sgpa}</span>
                ))}
              </div>
            </div>

            <div className="glass-panel grid-card row-half">
              <h3>Technical Skills</h3>
              <div className="skill-tags">
                {portfolio.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Projects */}
          <div className="dashboard-row">
            <div className="glass-panel grid-card" style={{width: '100%'}}>
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
          </div>

          {/* Row 4: Achievements, Certs, Hobbies */}
          <div className="dashboard-row">
            <div className="glass-panel grid-card row-third">
              <h3>Achievements</h3>
              <ul className="list-items">
                {portfolio.achievements && portfolio.achievements.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>

            <div className="glass-panel grid-card row-third">
              <h3>Certifications</h3>
              <ul className="list-items">
                {portfolio.certifications && portfolio.certifications.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>

            <div className="glass-panel grid-card row-third">
              <h3>Hobbies</h3>
              <div className="hobby-tags">
                {portfolio.hobbies && portfolio.hobbies.map((hobby, i) => <span key={i} className="hobby-tag">{hobby}</span>)}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;