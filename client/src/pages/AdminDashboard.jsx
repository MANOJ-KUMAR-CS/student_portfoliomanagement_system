import React, { useState } from 'react';
import api from '../api/axios';
import Alert from '../components/Alert';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [viewingPortfolio, setViewingPortfolio] = useState(null);

  // Skill Search State
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [skillSearchResults, setSkillSearchResults] = useState([]);
  const [isSkillSearching, setIsSkillSearching] = useState(false);

  // Register Form State
  const [registerData, setRegisterData] = useState({
    userName: '', email: '', phoneNo: '', role: 'student', password: ''
  });

  const [alertConfig, setAlertConfig] = useState({ show: false, message: '', type: 'success' });

  const showAlert = (message, type) => {
    setAlertConfig({ show: true, message, type });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setViewingPortfolio(null); // Clear view when searching
    try {
      const response = await api.get(`/admin/studentsearch?name=${searchQuery}`);
      setSearchResults(response.data.data);
    } catch (err) {
      setSearchResults([]);
      showAlert(err.response?.data?.message || 'No students found', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSkillSearch = async (e) => {
    e.preventDefault();
    if (!skillSearchQuery.trim()) return;

    setIsSkillSearching(true);
    setViewingPortfolio(null);
    try {
        // Splitting by comma if multiple skills are entered, though backend handles 'skill' as an array
        // The backend expects { skill: ["react", "node"] } or similar. 
        // Let's assume user enters comma separated skills or single skill
        const skillsArray = skillSearchQuery.split(',').map(s => s.trim()).filter(s => s);
        
        const response = await api.post('/admin/getstudent', { skill: skillsArray });
        setSkillSearchResults(response.data.data);
    } catch (err) {
        setSkillSearchResults([]);
        showAlert(err.response?.data?.message || 'No students found with these skills', 'error');
    } finally {
        setIsSkillSearching(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/user/register', registerData);
      showAlert('User Registered Successfully!', 'success');
      setRegisterData({ userName: '', email: '', phoneNo: '', role: 'student', password: '' });
    } catch (err) {
      showAlert(err.response?.data?.message || 'Registration failed', 'error');
    }
  };

  // View Portfolio Feature
  const viewPortfolio = async (id) => {
    try {
      // The id passed here is st_id from the user document
      const response = await api.get(`/admin/getdetails?id=${id}`);
      if(response.data.data) {
          setViewingPortfolio(response.data.data);
      } else {
          showAlert('Portfolio not found for this student', 'info');
      }
    } catch (err) {
        // If 404, it means no portfolio created yet
        showAlert('This student has not created a portfolio yet.', 'info');
    }
  };

  const closePortfolioView = () => {
    setViewingPortfolio(null);
  };

  return (
    <div className="admin-container">
      {alertConfig.show && (
        <Alert 
          message={alertConfig.message} 
          type={alertConfig.type} 
          onClose={() => setAlertConfig({ ...alertConfig, show: false })} 
        />
      )}

      {/* Sidebar */}
      <aside className="glass-panel admin-sidebar">
        <div className="sidebar-brand">Admin Panel</div>
        <nav className="sidebar-nav">
          <ul>
            <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => { setActiveTab('dashboard'); setViewingPortfolio(null); }}>Dashboard</li>
            <li className={activeTab === 'search' ? 'active' : ''} onClick={() => { setActiveTab('search'); setViewingPortfolio(null); }}>Search Students</li>
            <li className={activeTab === 'skillSearch' ? 'active' : ''} onClick={() => { setActiveTab('skillSearch'); setViewingPortfolio(null); }}>Search by Skill</li>
            <li className={activeTab === 'register' ? 'active' : ''} onClick={() => { setActiveTab('register'); setViewingPortfolio(null); }}>Register User</li>
            <li onClick={handleLogout} className="logout-btn">Logout</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="glass-panel admin-header">
          <h2>
            {activeTab === 'search' && viewingPortfolio ? 'Student Portfolio' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
          <div className="user-profile">
            <span>Admin</span>
            <div className="profile-img">A</div>
          </div>
        </header>

        <div className="content-area">
          {activeTab === 'dashboard' && (
            <div className="admin-dashboard-hero glass-panel">
              <div className="admin-hero-content">
                <div className="admin-hero-text">
                  <h1>Welcome to the Placement Cell Portal</h1>
                  <p>Streamline your campus hiring process. Manage student profiles, track academic performance, and match the right talent with the right opportunities efficiently.</p>
                  
                  <div className="hero-action-cards">
                    <div className="action-card" onClick={() => setActiveTab('search')}>
                      <div className="action-icon">🔍</div>
                      <h4>Search Students</h4>
                      <span>Find specific portfolios</span>
                    </div>
                    <div className="action-card" onClick={() => setActiveTab('skillSearch')}>
                      <div className="action-icon">⭐</div>
                      <h4>Skill Search</h4>
                      <span>Filter by expertise</span>
                    </div>
                    <div className="action-card" onClick={() => setActiveTab('register')}>
                      <div className="action-icon">➕</div>
                      <h4>Register User</h4>
                      <span>Create new accounts</span>
                    </div>
                  </div>
                </div>
                
                <div className="admin-hero-image-wrapper">
                  <img 
                    src="https://illustrations.popsy.co/amber/keynote-presentation.svg" 
                    alt="Administrator managing placement cell" 
                    className="admin-hero-image"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="glass-panel search-section">
              {!viewingPortfolio ? (
                <>
                  <h3>Find Student Portfolios</h3>
                  <form onSubmit={handleSearch} className="search-bar">
                    <input 
                      className="input-field" 
                      placeholder="Enter student name..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="btn-primary" disabled={isSearching}>
                      {isSearching ? 'Searching...' : 'Search'}
                    </button>
                  </form>

                  <div className="results-grid" style={{ marginTop: '30px' }}>
                    {searchResults.map((student) => (
                      <div key={student.id || student.st_id} className="glass-panel result-card">
                        <div className="result-icon">
                          👤
                        </div>
                        <div className="result-details">
                           <h4>Name: {student.userName}</h4>
                           <p>📧 {student.email}</p>
                           <p>📞 {student.phoneNo || student.header?.phone_no}</p>
                           <button className="btn-primary" style={{marginTop:'10px'}} onClick={() => viewPortfolio(student.id || student.st_id)}>View Portfolio</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* Admin View of Student Portfolio - Reusing structure from StudentDashboard.css */
                <div className="dashboard-wrapper" style={{ padding: 0 }}>
                  <button onClick={closePortfolioView} className="btn-primary" style={{ marginBottom: '20px', background: '#94A3B8' }}>Back to Search</button>
                  
                  {/* Reuse StudentDashboard classes directly since they are globally valid now */}
                    <section className="glass-panel profile-header-card">
                      <div className="profile-info">
                        <div className="header-top">
                          <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                             <div style={{
                               width:'60px', height:'60px', borderRadius:'50%', background:'white', 
                               display:'flex', alignItems:'center', justifyContent:'center', fontSize:'30px',
                               color:'var(--primary)'
                             }}>
                                👤
                             </div>
                             <div>
                               <h1 style={{fontSize:'2rem'}}>Name: {viewingPortfolio.header.name}</h1>
                             </div>
                          </div>
                        </div>
                        <p className="subtitle profile-indent">
                            {viewingPortfolio.header.dept} • Year {viewingPortfolio.header.year} • Sem {viewingPortfolio.header.sem}
                        </p>
                        <div className="contact-bar profile-indent" style={{flexDirection:'column', alignItems:'flex-start', gap:'8px'}}>
                          <span>📧 Email: {viewingPortfolio.header.email}</span>
                          <span>📞 Phone: {viewingPortfolio.header.phone_no}</span>
                        </div>
                        <div className="link-badges profile-indent" style={{marginTop:'15px'}}>
                          {viewingPortfolio.header.git_link && (
                              <a href={viewingPortfolio.header.git_link} target="_blank" rel="noreferrer" className="link-tag">
                                  <span>🐙</span> GitHub
                              </a>
                          )}
                          {viewingPortfolio.header.linkedin_link && (
                              <a href={viewingPortfolio.header.linkedin_link} target="_blank" rel="noreferrer" className="link-tag">
                                  <span>💼</span> LinkedIn
                              </a>
                          )}
                          {viewingPortfolio.header.leetcode_link && (
                              <a href={viewingPortfolio.header.leetcode_link} target="_blank" rel="noreferrer" className="link-tag">
                                  <span>💻</span> LeetCode
                              </a>
                          )}
                        </div>
                      </div>
                    </section>

                    <div className="dashboard-content-wrapper">
                      {/* Row 1: Objective */}
                      <div className="dashboard-row">
                        <div className="glass-panel grid-card" style={{width: '100%'}}>
                          <h3>Career Objective</h3>
                          <p className="objective-text">{viewingPortfolio.objective}</p>
                        </div>
                      </div>

                      {/* Row 2: Academic & Skills */}
                      <div className="dashboard-row">
                        <div className="glass-panel grid-card row-half">
                          <h3>Academic Performance</h3>
                          <div className="stats-container">
                            <div className="stat-box highlight">
                              <span>CGPA</span>
                              <p>{viewingPortfolio.academic.cgpa}</p>
                            </div>
                            <div className="stat-box">
                              <span>10th %</span>
                              <p>{viewingPortfolio.academic.tenth_percentage}%</p>
                            </div>
                            <div className="stat-box">
                              <span>12th %</span>
                              <p>{viewingPortfolio.academic.twelfth_percentage}%</p>
                            </div>
                          </div>
                          <h4 className="header-h4">Semester Wise (SGPA)</h4>
                          <div className="sgpa-chips">
                            {viewingPortfolio.academic.sgpas.map((sgpa, index) => (
                              <span key={index} className="sgpa-chip">S{index + 1}: {sgpa}</span>
                            ))}
                          </div>
                        </div>

                        <div className="glass-panel grid-card row-half">
                          <h3>Technical Skills</h3>
                          <div className="skill-tags">
                            {viewingPortfolio.skills.map((skill, index) => (
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
                            {viewingPortfolio.projects.map((project, index) => (
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
                            {viewingPortfolio.achievements && viewingPortfolio.achievements.map((item, i) => <li key={i}>{item}</li>)}
                          </ul>
                        </div>

                        <div className="glass-panel grid-card row-third">
                          <h3>Certifications</h3>
                          <ul className="list-items">
                            {viewingPortfolio.certifications && viewingPortfolio.certifications.map((item, i) => <li key={i}>{item}</li>)}
                          </ul>
                        </div>

                        <div className="glass-panel grid-card row-third">
                          <h3>Hobbies</h3>
                          <div className="hobby-tags">
                            {viewingPortfolio.hobbies && viewingPortfolio.hobbies.map((hobby, i) => <span key={i} className="hobby-tag">{hobby}</span>)}
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'skillSearch' && (
             <div className="glass-panel search-section">
               {!viewingPortfolio ? (
                 <>
                   <h3>Search Students by Skill</h3>
                   <form onSubmit={handleSkillSearch} className="search-bar">
                     <input 
                       className="input-field" 
                       placeholder="Enter skill (e.g., React, Python)..." 
                       value={skillSearchQuery}
                       onChange={(e) => setSkillSearchQuery(e.target.value)}
                     />
                     <button type="submit" className="btn-primary" disabled={isSkillSearching}>
                       {isSkillSearching ? 'Searching...' : 'Search'}
                     </button>
                   </form>
 
                   <div className="results-grid" style={{ marginTop: '30px' }}>
                     {skillSearchResults.map((student) => (
                       <div key={student.st_id} className="glass-panel result-card">
                         <div className="result-icon">
                           👤
                         </div>
                         <div className="result-details">
                            <h4>Name: {student.header.name}</h4>
                            <p>🎓 Year: {student.header.year}</p>
                            <p>📧 {student.header.email}</p>
                            <p>📞 {student.header.phone_no}</p>
                            <button className="btn-primary" style={{marginTop:'10px'}} onClick={() => viewPortfolio(student.st_id)}>View Profile</button>
                         </div>
                       </div>
                     ))}
                   </div>
                 </>
               ) : (
                /* Reuse the exact same portfolio view structure */
                 <div className="dashboard-wrapper" style={{ padding: 0 }}>
                   <button onClick={closePortfolioView} className="btn-primary" style={{ marginBottom: '20px', background: '#94A3B8' }}>Back to Search</button>
                   
                   {/* Reusing the same portfolio layout */}
                     <section className="glass-panel profile-header-card">
                       <div className="profile-info">
                         <div className="header-top">
                           <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                              <div style={{
                                width:'60px', height:'60px', borderRadius:'50%', background:'white', 
                                display:'flex', alignItems:'center', justifyContent:'center', fontSize:'30px',
                                color:'var(--primary)'
                              }}>
                                 👤
                              </div>
                              <div>
                                <h1 style={{fontSize:'2rem'}}>Name: {viewingPortfolio.header.name}</h1>
                              </div>
                           </div>
                         </div>
                         <p className="subtitle profile-indent">
                             {viewingPortfolio.header.dept} • Year {viewingPortfolio.header.year} • Sem {viewingPortfolio.header.sem}
                         </p>
                         <div className="contact-bar profile-indent" style={{flexDirection:'column', alignItems:'flex-start', gap:'8px'}}>
                           <span>📧 Email: {viewingPortfolio.header.email}</span>
                           <span>📞 Phone: {viewingPortfolio.header.phone_no}</span>
                         </div>
                         <div className="link-badges profile-indent" style={{marginTop:'15px'}}>
                           {viewingPortfolio.header.git_link && (
                               <a href={viewingPortfolio.header.git_link} target="_blank" rel="noreferrer" className="link-tag">
                                   <span>🐙</span> GitHub
                               </a>
                           )}
                           {viewingPortfolio.header.linkedin_link && (
                               <a href={viewingPortfolio.header.linkedin_link} target="_blank" rel="noreferrer" className="link-tag">
                                   <span>💼</span> LinkedIn
                               </a>
                           )}
                           {viewingPortfolio.header.leetcode_link && (
                               <a href={viewingPortfolio.header.leetcode_link} target="_blank" rel="noreferrer" className="link-tag">
                                   <span>💻</span> LeetCode
                               </a>
                           )}
                         </div>
                       </div>
                     </section>
 
                     <div className="dashboard-content-wrapper">
                       <div className="dashboard-row">
                         <div className="glass-panel grid-card" style={{width: '100%'}}>
                           <h3>Career Objective</h3>
                           <p className="objective-text">{viewingPortfolio.objective}</p>
                         </div>
                       </div>
 
                       <div className="dashboard-row">
                         <div className="glass-panel grid-card row-half">
                           <h3>Academic Performance</h3>
                           <div className="stats-container">
                             <div className="stat-box highlight">
                               <span>CGPA</span>
                               <p>{viewingPortfolio.academic.cgpa}</p>
                             </div>
                             <div className="stat-box">
                               <span>10th %</span>
                               <p>{viewingPortfolio.academic.tenth_percentage}%</p>
                             </div>
                             <div className="stat-box">
                               <span>12th %</span>
                               <p>{viewingPortfolio.academic.twelfth_percentage}%</p>
                             </div>
                           </div>
                           <h4 className="header-h4">Semester Wise (SGPA)</h4>
                           <div className="sgpa-chips">
                             {viewingPortfolio.academic.sgpas.map((sgpa, index) => (
                               <span key={index} className="sgpa-chip">S{index + 1}: {sgpa}</span>
                             ))}
                           </div>
                         </div>
 
                         <div className="glass-panel grid-card row-half">
                           <h3>Technical Skills</h3>
                           <div className="skill-tags">
                             {viewingPortfolio.skills.map((skill, index) => (
                               <span key={index} className="skill-tag">{skill}</span>
                             ))}
                           </div>
                         </div>
                       </div>
 
                       <div className="dashboard-row">
                         <div className="glass-panel grid-card" style={{width: '100%'}}>
                           <h3>Projects</h3>
                           <div className="projects-list">
                             {viewingPortfolio.projects.map((project, index) => (
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
 
                       <div className="dashboard-row">
                         <div className="glass-panel grid-card row-third">
                           <h3>Achievements</h3>
                           <ul className="list-items">
                             {viewingPortfolio.achievements && viewingPortfolio.achievements.map((item, i) => <li key={i}>{item}</li>)}
                           </ul>
                         </div>
 
                         <div className="glass-panel grid-card row-third">
                           <h3>Certifications</h3>
                           <ul className="list-items">
                             {viewingPortfolio.certifications && viewingPortfolio.certifications.map((item, i) => <li key={i}>{item}</li>)}
                           </ul>
                         </div>
 
                         <div className="glass-panel grid-card row-third">
                           <h3>Hobbies</h3>
                           <div className="hobby-tags">
                             {viewingPortfolio.hobbies && viewingPortfolio.hobbies.map((hobby, i) => <span key={i} className="hobby-tag">{hobby}</span>)}
                           </div>
                         </div>
                       </div>
                     </div>
                 </div>
               )}
             </div>
           )}

          {activeTab === 'register' && (
            <div className="glass-panel register-section">
              <h3>Register New User</h3>
              <form onSubmit={handleRegister} className="register-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    className="input-field" 
                    value={registerData.userName}
                    onChange={(e) => setRegisterData({...registerData, userName: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    className="input-field" 
                    type="email" 
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    className="input-field" 
                    value={registerData.phoneNo}
                    onChange={(e) => setRegisterData({...registerData, phoneNo: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select 
                    className="input-field"
                    value={registerData.role}
                    onChange={(e) => setRegisterData({...registerData, role: e.target.value})}
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input 
                    className="input-field" 
                    type="password" 
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    required 
                  />
                </div>
                <button type="submit" className="btn-primary">Create Account</button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;