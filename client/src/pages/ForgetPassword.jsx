import React, { useState } from 'react';
import axios from 'axios';
import Alert from '../components/Alert';
import '../styles/ForgetPassword.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState(''); // New state to store the verification token 🔑
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [alertConfig, setAlertConfig] = useState({ show: false, message: '', type: 'success' });

  const showAlert = (message, type) => {
    setAlertConfig({ show: true, message, type });
  };

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    if (!email) return showAlert('Please enter your email', 'error');

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/user/generateopt', { email });
      showAlert(response.data.message, 'success');
      setStep(2);
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to send OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Store Token 📥
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) return showAlert('Please enter the OTP', 'error');

    setLoading(true);
    try {
      // Replace with your actual OTP verification endpoint
      const response = await axios.post('http://localhost:5000/user/verifyotp', { email, otp });
      
      // Store the token sent from backend
      setResetToken(response.data.token); 
      
      showAlert('OTP Verified! Set your new password.', 'success');
      setStep(3);
    } catch (err) {
      showAlert(err.response?.data?.message || 'Invalid OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password using the Token 🔐
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      return showAlert('Passwords do not match', 'error');
    }
    if (newPassword.length < 4) {
      return showAlert('Password must be at least 4 characters', 'error');
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/user/resetpassword', 
        { email,
          newPassword // Send new password in body
        }, 
        {
          headers: {
            'Authorization': `Bearer ${resetToken}` // Send token in Header 🛡️
          }
        }
      );

      showAlert('Password updated successfully!', 'success');
      
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to reset password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => handleSendOTP();

  return (
    <div className="forgot-password-container">
      {alertConfig.show && (
        <Alert 
          message={alertConfig.message} 
          type={alertConfig.type} 
          onClose={() => setAlertConfig({ ...alertConfig, show: false })} 
        />
      )}

      <div className="forgot-password-card">
        <div className="card-header">
          <h2>Reset Password</h2>
          <div className="step-indicator">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
            <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
          </div>
        </div>

        {step === 1 && (
          <form onSubmit={handleSendOTP} className="form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="form">
            <p className="instruction">Enter code sent to <strong>{email}</strong></p>
            <div className="form-group">
              <label>Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
                maxLength="6"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleResendOTP} disabled={loading}>
              Resend OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="form">
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        <div className="back-to-login">
          <a href="/login">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;