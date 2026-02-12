import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import ForgotPassword from './pages/ForgetPassword';
import Dashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard'; 
import PortfolioForm from './pages/PortfolioForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/register-portfolio" element={<PortfolioForm />} />
        <Route path="/" element={<LoginPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;