import React, { useState } from 'react';
import axios from 'axios';
import Alert from '../components/Alert';
import '../styles/PortfolioForm.css'; // Reusing your modern styles

const PortfolioForm = () => {
  const [loading, setLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ show: false, message: '', type: 'success' });

  // Initialize state based on your Mongoose Schema
  const [formData, setFormData] = useState({
    st_id: JSON.parse(localStorage.getItem('user'))?.id || '',
    header: { name: '', email: '', phone_no: '', dept: '', year: '', sem: '', git_link: '', linkedin_link: '', leetcode_link: '' },
    objective: '',
    academic: { cgpa: '', sgpas: '', tenth_percentage: '', twelfth_percentage: '' },
    skills: '',
    projects: [{ title: '', tech_stack: '', description: '' }],
    certifications: '',
    achievements: '',
    hobbies: ''
  });

  const showAlert = (message, type) => setAlertConfig({ show: true, message, type });

  // Handle nested object changes
  const handleNestedChange = (e, section) => {
    setFormData({
      ...formData,
      [section]: { ...formData[section], [e.target.name]: e.target.value }
    });
  };

  // Handle Project Array changes
  const handleProjectChange = (index, e) => {
    const newProjects = [...formData.projects];
    newProjects[index][e.target.name] = e.target.value;
    setFormData({ ...formData, projects: newProjects });
  };

  const addProject = () => {
    setFormData({ ...formData, projects: [...formData.projects, { title: '', tech_stack: '', description: '' }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare data (convert comma strings to arrays)
    const finalData = {
      ...formData,
      academic: {
        ...formData.academic,
        sgpas: formData.academic.sgpas.split(',').map(Number)
      },
      skills: formData.skills.split(','),
      certifications: formData.certifications.split(','),
      achievements: formData.achievements.split(','),
      hobbies: formData.hobbies.split(','),
      projects: formData.projects.map(p => ({
        ...p,
        tech_stack: p.tech_stack.split(',')
      }))
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/portfolio', finalData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Store in LocalStorage
      localStorage.setItem('portfolio_data', JSON.stringify(response.data.data));
      showAlert('Portfolio Created Successfully!', 'success');
      
      // Redirect to Dashboard
      setTimeout(() => window.location.href = '/dashboard', 2000);
    } catch (err) {
      showAlert(err.response?.data?.message || 'Error creating portfolio', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {alertConfig.show && <Alert message={alertConfig.message} type={alertConfig.type} onClose={() => setAlertConfig({ ...alertConfig, show: false })} />}
      
      <form onSubmit={handleSubmit} className="login-card" style={{ maxWidth: '800px' }}>
        <h2 style={{ marginBottom: '20px' }}>Student Details Form</h2>

        {/* Header Section */}
        <div className="form-section">
          <h3>Personal Header</h3>
          <div className="dashboard-grid">
            <input name="name" placeholder="Full Name" onChange={(e) => handleNestedChange(e, 'header')} required />
            <input name="email" placeholder="Email" onChange={(e) => handleNestedChange(e, 'header')} required />
            <input name="phone_no" placeholder="Phone Number" onChange={(e) => handleNestedChange(e, 'header')} required />
            <input name="dept" placeholder="Department (e.g. ECE)" onChange={(e) => handleNestedChange(e, 'header')} required />
            <input name="year" placeholder="Year" onChange={(e) => handleNestedChange(e, 'header')} required />
            <input name="sem" placeholder="Semester" onChange={(e) => handleNestedChange(e, 'header')} required />
            <input name="git_link" placeholder="GitHub Link" onChange={(e) => handleNestedChange(e, 'header')} required />
            <input name="linkedin_link" placeholder="LinkedIn Link" onChange={(e) => handleNestedChange(e, 'header')} required />
            <input name="leetcode_link" placeholder="LeetCode Link" onChange={(e) => handleNestedChange(e, 'header')} required />
          </div>
        </div>

        {/* Objective Section */}
        <div className="form-section" style={{ marginTop: '20px' }}>
          <h3>Career Objective</h3>
          <textarea style={{ width: '100%', padding: '10px' }} onChange={(e) => setFormData({...formData, objective: e.target.value})} required />
        </div>

        {/* Academics Section */}
        <div className="form-section" style={{ marginTop: '20px' }}>
          <h3>Academic Details</h3>
          <div className="dashboard-grid">
            <input name="cgpa" type="number" step="0.01" placeholder="CGPA" onChange={(e) => handleNestedChange(e, 'academic')} required />
            <input name="sgpas" placeholder="SGPAs (comma separated: 8.5, 9.0)" onChange={(e) => handleNestedChange(e, 'academic')} required />
            <input name="tenth_percentage" type="number" placeholder="10th %" onChange={(e) => handleNestedChange(e, 'academic')} required />
            <input name="twelfth_percentage" type="number" placeholder="12th %" onChange={(e) => handleNestedChange(e, 'academic')} required />
          </div>
        </div>

        {/* Arrays Section */}
        <div className="form-section" style={{ marginTop: '20px' }}>
          <h3>Skills & Achievements (Comma Separated)</h3>
          <input placeholder="Skills (Java, React, C)" onChange={(e) => setFormData({...formData, skills: e.target.value})} required />
          <input placeholder="Certifications" onChange={(e) => setFormData({...formData, certifications: e.target.value})} required />
          <input placeholder="Achievements" onChange={(e) => setFormData({...formData, achievements: e.target.value})} required />
          <input placeholder="Hobbies" onChange={(e) => setFormData({...formData, hobbies: e.target.value})} required />
        </div>

        {/* Projects Section */}
        <div className="form-section" style={{ marginTop: '20px' }}>
          <h3>Projects</h3>
          {formData.projects.map((proj, index) => (
            <div key={index} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
              <input name="title" placeholder="Project Title" onChange={(e) => handleProjectChange(index, e)} required />
              <input name="tech_stack" placeholder="Tech Stack (comma separated)" onChange={(e) => handleProjectChange(index, e)} required />
              <textarea name="description" placeholder="Description" style={{ width: '100%' }} onChange={(e) => handleProjectChange(index, e)} required />
            </div>
          ))}
          <button type="button" onClick={addProject} className="btn-google" style={{ marginTop: '10px' }}>+ Add Project</button>
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: '30px' }} disabled={loading}>
          {loading ? 'Creating Portfolio...' : 'Save Portfolio Details'}
        </button>
      </form>
    </div>
  );
};

export default PortfolioForm;