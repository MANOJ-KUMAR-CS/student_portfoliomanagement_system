import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Alert from '../components/Alert';
import { useNavigate } from 'react-router-dom';
import '../styles/PortfolioForm.css'; 

const PortfolioForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ show: false, message: '', type: 'success' });
  const [isEditing, setIsEditing] = useState(false);

  // Initial State
  const [formData, setFormData] = useState({
    st_id: JSON.parse(localStorage.getItem('user'))?.id || '',
    header: { name: '', email: '', phone_no: '', dept: '', year: '', sem: '', git_link: '', linkedin_link: '', leetcode_link: '' },
    objective: '',
    academic: { cgpa: '', sgpas: [], tenth_percentage: '', twelfth_percentage: '' },
    skills: [],
    projects: [{ title: '', tech_stack: [], description: '' }],
    certifications: [],
    achievements: [],
    hobbies: []
  });

  // Temporary state for inputs
  const [tempInputs, setTempInputs] = useState({
    skills: '',
    certifications: '',
    achievements: '',
    hobbies: '',
    sgpa: '',
    project_tech: [] // Array of strings for each project index
  });

  useEffect(() => {
    const fetchData = async () => {
       const user = JSON.parse(localStorage.getItem('user'));
       const existingData = JSON.parse(localStorage.getItem('portfolio_data'));

       // Pre-fill Name and Email from User Login Data
       if (user) {
         setFormData(prev => ({
            ...prev,
            st_id: user.id || user.st_id,
            header: {
                ...prev.header,
                // Check multiple keys for robustness (userName, username, name)
                name: user.userName || user.username || user.name || '',
                email: user.email || ''
            }
         }));
       }

       if (existingData) {
         setIsEditing(true);
         setFormData(prev => ({
            ...existingData,
            // Ensure we keep the locked values from user login if they are missing or to enforce consistency
            header: {
                ...existingData.header,
                name: user?.userName || user?.username || user?.name || existingData.header.name || '',
                email: user?.email || existingData.header.email || ''
            },
            skills: Array.isArray(existingData.skills) ? existingData.skills : (existingData.skills || '').split(','),
            certifications: Array.isArray(existingData.certifications) ? existingData.certifications : (existingData.certifications || '').split(','),
            achievements: Array.isArray(existingData.achievements) ? existingData.achievements : (existingData.achievements || '').split(','),
            hobbies: Array.isArray(existingData.hobbies) ? existingData.hobbies : (existingData.hobbies || '').split(','),
            projects: existingData.projects.map(p => ({
                ...p,
                tech_stack: Array.isArray(p.tech_stack) ? p.tech_stack : (p.tech_stack || '').split(',').map(s=>s.trim())
            })),
            academic: {
                ...existingData.academic,
                sgpas: Array.isArray(existingData.academic.sgpas) ? existingData.academic.sgpas : (typeof existingData.academic.sgpas === 'string' ? existingData.academic.sgpas.split(',').map(Number) : [])
            }
         }));
         // Initialize temp tech inputs for projects
         setTempInputs(prev => ({
             ...prev,
             project_tech: new Array(existingData.projects.length).fill('')
         }));
       } else {
         setTempInputs(prev => ({ ...prev, project_tech: [''] }));
       }
    };
    fetchData();
  }, []);

  const handleNestedChange = (e, section) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [name]: value }
    }));
  };

  // Dynamic Array Handlers
  const handleAddItem = (field, value) => {
    if (!value.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], value]
    }));
    setTempInputs(prev => ({ ...prev, [field]: '' })); // Clear input
  };

  const handleRemoveItem = (field, index) => {
      setFormData(prev => ({
          ...prev,
          [field]: prev[field].filter((_, i) => i !== index)
      }));
  };
  
  // SGPA Handler
  const handleAddSgpa = () => {
      if (!tempInputs.sgpa.trim()) return;
      if (formData.academic.sgpas.length >= 8) {
          setAlertConfig({ show: true, message: 'Maximum 8 SGPAs allowed', type: 'error' });
          return;
      }
      setFormData(prev => ({
          ...prev,
          academic: { ...prev.academic, sgpas: [...prev.academic.sgpas, parseFloat(tempInputs.sgpa)] }
      }));
      setTempInputs(prev => ({ ...prev, sgpa: '' }));
  };

  const handleRemoveSgpa = (index) => {
      setFormData(prev => ({
          ...prev,
          academic: { ...prev.academic, sgpas: prev.academic.sgpas.filter((_, i) => i !== index) }
      }));
  };

  // Project Handlers
  const handleProjectChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProjects = [...formData.projects];
    updatedProjects[index] = { ...updatedProjects[index], [name]: value };
    setFormData({ ...formData, projects: updatedProjects });
  };

  const addProject = () => {
    setFormData({ ...formData, projects: [...formData.projects, { title: '', tech_stack: [], description: '' }] });
    setTempInputs(prev => ({ ...prev, project_tech: [...prev.project_tech, ''] }));
  };

  const removeProject = (index) => {
    const updatedProjects = formData.projects.filter((_, i) => i !== index);
    setFormData({ ...formData, projects: updatedProjects });
    setTempInputs(prev => ({ ...prev, project_tech: prev.project_tech.filter((_, i) => i !== index) }));
  };

  // Project Tech Stack Handlers
  const handleAddProjectTech = (index) => {
      const val = tempInputs.project_tech[index];
      if (!val || !val.trim()) return;

      const updatedProjects = [...formData.projects];
      updatedProjects[index].tech_stack = [...updatedProjects[index].tech_stack, val.trim()];
      setFormData({ ...formData, projects: updatedProjects });
      
      const newTechInputs = [...tempInputs.project_tech];
      newTechInputs[index] = '';
      setTempInputs({ ...tempInputs, project_tech: newTechInputs });
  };

  const handleRemoveProjectTech = (pIndex, tIndex) => {
      const updatedProjects = [...formData.projects];
      updatedProjects[pIndex].tech_stack = updatedProjects[pIndex].tech_stack.filter((_, i) => i !== tIndex);
      setFormData({ ...formData, projects: updatedProjects });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isEditing 
        ? `/student/updateportfolio/${formData.st_id}`
        : `/student/createportfolio/${formData.st_id}`;
      
      const method = isEditing ? 'put' : 'post';
      
      const response = await api[method](url, formData);

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem('portfolio_data', JSON.stringify(formData));
        setAlertConfig({ show: true, message: 'Portfolio Saved Successfully!', type: 'success' });
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (error) {
      setAlertConfig({ show: true, message: error.response?.data?.message || 'Failed to save portfolio', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {alertConfig.show && <Alert message={alertConfig.message} type={alertConfig.type} onClose={() => setAlertConfig({ ...alertConfig, show: false })} />}
      
      <form onSubmit={handleSubmit} className="glass-panel portfolio-form-card">
        <div className="form-header">
             <h2>{isEditing ? 'Edit Portfolio' : 'Create Portfolio'}</h2>
             <button type="button" className="btn-cancel" onClick={() => navigate(isEditing ? '/dashboard' : '/login')}>Cancel</button>
        </div>
        {/* Header Section */}
        <div className="form-section">
          <h3>👤 Personal Details</h3>
          <div className="dashboard-grid">
            <div className="input-group">
                <label>👤 Full Name</label>
                <input className="input-field readonly-field" name="name" placeholder="Full Name" value={formData.header.name} readOnly disabled />
            </div>
            <div className="input-group">
                <label>📧 User Email</label>
                <input className="input-field readonly-field" name="email" placeholder="User Email" value={formData.header.email} readOnly disabled />
            </div>
            <div className="input-group">
                <label>📞 Phone Number</label>
                <input className="input-field" name="phone_no" placeholder="Enter Phone No." value={formData.header.phone_no} onChange={(e) => handleNestedChange(e, 'header')} required />
            </div>
            <div className="input-group">
                <label>🏫 Department</label>
                <input className="input-field" name="dept" placeholder="e.g. ECE, CSE" value={formData.header.dept} onChange={(e) => handleNestedChange(e, 'header')} required />
            </div>
            <div className="input-group">
                <label>📅 Year</label>
                <input className="input-field" name="year" placeholder="e.g. 3rd" value={formData.header.year} onChange={(e) => handleNestedChange(e, 'header')} required />
            </div>
            <div className="input-group">
                <label>📚 Semester</label>
                <input className="input-field" name="sem" placeholder="e.g. 5th" value={formData.header.sem} onChange={(e) => handleNestedChange(e, 'header')} required />
            </div>
            <div className="input-group">
                <label>🐙 GitHub Link</label>
                <input className="input-field" name="git_link" placeholder="GitHub URL" value={formData.header.git_link} onChange={(e) => handleNestedChange(e, 'header')} />
            </div>
            <div className="input-group">
                <label>💼 LinkedIn Link</label>
                <input className="input-field" name="linkedin_link" placeholder="LinkedIn URL" value={formData.header.linkedin_link} onChange={(e) => handleNestedChange(e, 'header')} />
            </div>
            <div className="input-group">
                <label>💻 LeetCode Link</label>
                <input className="input-field" name="leetcode_link" placeholder="LeetCode URL" value={formData.header.leetcode_link} onChange={(e) => handleNestedChange(e, 'header')} />
            </div>
          </div>
        </div>

        {/* Objective Section */}
        <div className="form-section">
          <h3>🎯 Career Objective</h3>
          <textarea className="input-field textarea-field" placeholder="Write a brief objective summarizing your career goals..." value={formData.objective} onChange={(e) => setFormData({...formData, objective: e.target.value})} required />
        </div>

        {/* Academics Section */}
        <div className="form-section">
          <h3>🎓 Academic Details</h3>
          <div className="dashboard-grid">
            <div className="input-group">
                <label>📊 CGPA</label>
                <input className="input-field" name="cgpa" type="number" step="0.01" placeholder="Current CGPA" value={formData.academic.cgpa} onChange={(e) => handleNestedChange(e, 'academic')} required />
            </div>
            
            <div className="input-group">
                <label>🏫 10th Percentage</label>
                <input className="input-field" name="tenth_percentage" type="number" placeholder="10th %" value={formData.academic.tenth_percentage} onChange={(e) => handleNestedChange(e, 'academic')} required />
            </div>
            <div className="input-group">
                <label>🏫 12th Percentage</label>
                <input className="input-field" name="twelfth_percentage" type="number" placeholder="12th %" value={formData.academic.twelfth_percentage} onChange={(e) => handleNestedChange(e, 'academic')} required />
            </div>

            {/* Dynamic SGPAs - Full Width or Grid Item */}
            <div className="tag-input-container" style={{gridColumn: '1 / -1'}}>
                 <label>📈 Semester SGPAs (Max 8)</label>
                 <div className="tags-list">
                     {formData.academic.sgpas.map((sgpa, i) => (
                         <span key={i} className="tag-item">
                             Sem {i+1}: {sgpa} <span className="tag-remove" onClick={() => handleRemoveSgpa(i)}>×</span>
                         </span>
                     ))}
                 </div>
                 <div className="tag-input-wrapper">
                     <input className="input-field" type="number" step="0.01" placeholder="Enter SGPA..." value={tempInputs.sgpa} onChange={(e) => setTempInputs({...tempInputs, sgpa: e.target.value})} 
                         onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSgpa())} />
                     <button type="button" className="btn-add-tag" onClick={handleAddSgpa}>+</button>
                 </div>
            </div>
          </div>
        </div>

        {/* Arrays Section - Now Dynamic */}
        <div className="form-section">
          <h3>🛠 Skills & Achievements</h3>
          <div className="dashboard-grid">
             
             {/* Skills */}
             <div className="tag-input-container">
                 <label>⚡ Skills</label>
                 <div className="tags-list">
                     {formData.skills.map((item, i) => (
                         <span key={i} className="tag-item">{item} <span className="tag-remove" onClick={() => handleRemoveItem('skills', i)}>×</span></span>
                     ))}
                 </div>
                 <div className="tag-input-wrapper">
                     <input className="input-field" placeholder="Add Skill... (Press Enter)" value={tempInputs.skills} onChange={(e) => setTempInputs({...tempInputs, skills: e.target.value})} 
                         onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('skills', tempInputs.skills))} />
                     <button type="button" className="btn-add-tag" onClick={() => handleAddItem('skills', tempInputs.skills)}>+</button>
                 </div>
             </div>

             {/* Certifications */}
             <div className="tag-input-container">
                 <label>📜 Certifications</label>
                 <div className="tags-list">
                     {formData.certifications.map((item, i) => (
                         <span key={i} className="tag-item">{item} <span className="tag-remove" onClick={() => handleRemoveItem('certifications', i)}>×</span></span>
                     ))}
                 </div>
                 <div className="tag-input-wrapper">
                     <input className="input-field" placeholder="Add Certification..." value={tempInputs.certifications} onChange={(e) => setTempInputs({...tempInputs, certifications: e.target.value})} 
                         onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('certifications', tempInputs.certifications))} />
                     <button type="button" className="btn-add-tag" onClick={() => handleAddItem('certifications', tempInputs.certifications)}>+</button>
                 </div>
             </div>

             {/* Achievements */}
             <div className="tag-input-container">
                 <label>🏆 Achievements</label>
                 <div className="tags-list">
                     {formData.achievements.map((item, i) => (
                         <span key={i} className="tag-item">{item} <span className="tag-remove" onClick={() => handleRemoveItem('achievements', i)}>×</span></span>
                     ))}
                 </div>
                 <div className="tag-input-wrapper">
                     <input className="input-field" placeholder="Add Achievement..." value={tempInputs.achievements} onChange={(e) => setTempInputs({...tempInputs, achievements: e.target.value})} 
                         onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('achievements', tempInputs.achievements))} />
                     <button type="button" className="btn-add-tag" onClick={() => handleAddItem('achievements', tempInputs.achievements)}>+</button>
                 </div>
             </div>

             {/* Hobbies */}
             <div className="tag-input-container">
                 <label>🎨 Hobbies</label>
                 <div className="tags-list">
                     {formData.hobbies.map((item, i) => (
                         <span key={i} className="tag-item">{item} <span className="tag-remove" onClick={() => handleRemoveItem('hobbies', i)}>×</span></span>
                     ))}
                 </div>
                 <div className="tag-input-wrapper">
                     <input className="input-field" placeholder="Add Hobby..." value={tempInputs.hobbies} onChange={(e) => setTempInputs({...tempInputs, hobbies: e.target.value})} 
                         onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('hobbies', tempInputs.hobbies))} />
                     <button type="button" className="btn-add-tag" onClick={() => handleAddItem('hobbies', tempInputs.hobbies)}>+</button>
                 </div>
             </div>

          </div>
        </div>

        {/* Projects Section */}
        <div className="form-section">
          <h3>🚀 Projects</h3>
          {formData.projects.map((proj, index) => (
            <div key={index} className="glass-panel project-item">
              <div className="project-header">
                  <h4>Project {index + 1}</h4>
                  {formData.projects.length > 1 && <button type="button" onClick={() => removeProject(index)} className="btn-remove">Remove</button>}
              </div>
              <input className="input-field mb-small" name="title" placeholder="Project Title" value={proj.title} onChange={(e) => handleProjectChange(index, e)} required />
              
              {/* Project Tech Stack Dynamic */}
              <div className="tag-input-container mb-small">
                 <div className="tags-list">
                     {proj.tech_stack.map((tech, tIndex) => (
                         <span key={tIndex} className="tag-item">{tech} <span className="tag-remove" onClick={() => handleRemoveProjectTech(index, tIndex)}>×</span></span>
                     ))}
                 </div>
                 <div className="tag-input-wrapper">
                     <input className="input-field" placeholder="Add Tech Stack..." value={tempInputs.project_tech[index] || ''} 
                            onChange={(e) => {
                                const newTech = [...tempInputs.project_tech];
                                newTech[index] = e.target.value;
                                setTempInputs({...tempInputs, project_tech: newTech});
                            }} 
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddProjectTech(index))} />
                     <button type="button" className="btn-add-tag" onClick={() => handleAddProjectTech(index)}>+</button>
                 </div>
              </div>

              <textarea className="input-field textarea-field" name="description" placeholder="Description" value={proj.description} onChange={(e) => handleProjectChange(index, e)} required />
            </div>
          ))}
          <button type="button" onClick={addProject} className="btn-add-project">+ Add Project</button>
        </div>

        <button type="submit" className="btn-primary btn-submit" disabled={loading}>
          {loading ? 'Saving...' : (isEditing ? 'Update Portfolio' : 'Create Portfolio')}
        </button>
      </form>
    </div>
  );
};

export default PortfolioForm;