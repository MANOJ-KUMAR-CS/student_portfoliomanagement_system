import React from 'react';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  // Dummy data for the dashboard
  const stats = [
    { title: 'Total Students', count: '1,250', icon: '👨‍🎓', color: '#4e73df' },
    { title: 'Portfolios Created', count: '890', icon: '📁', color: '#1cc88a' },
    { title: 'Pending Approvals', count: '45', icon: '⏳', color: '#f6c23e' },
    { title: 'System Alerts', count: '12', icon: '⚠️', color: '#e74a3b' },
  ];

  return (
    <div className="admin-container">
      {/* Sidebar 🛠️ */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">Admin Panel</div>
        <nav className="sidebar-nav">
          <ul>
            <li className="active">Dashboard</li>
            <li>Manage Students</li>
            <li>Portfolio Reviews</li>
            <li>Settings</li>
            <li onClick={() => window.location.href = '/login'}>Logout</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content 🖥️ */}
      <main className="admin-main">
        <header className="admin-header">
          <h2>Dashboard Overview</h2>
          <div className="user-profile">
            <span>Welcome, Admin</span>
            <div className="profile-img">A</div>
          </div>
        </header>

        <section className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card" style={{ borderLeft: `5px solid ${stat.color}` }}>
              <div className="stat-info">
                <p>{stat.title}</p>
                <h3>{stat.count}</h3>
              </div>
              <div className="stat-icon">{stat.icon}</div>
            </div>
          ))}
        </section>

        <section className="recent-activity">
          <h3>Recent Student Signups</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#101</td>
                <td>John Doe</td>
                <td>john@university.edu</td>
                <td><span className="badge success">Active</span></td>
              </tr>
              <tr>
                <td>#102</td>
                <td>Jane Smith</td>
                <td>jane@university.edu</td>
                <td><span className="badge warning">Pending</span></td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;