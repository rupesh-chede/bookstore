import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', cpassword: '', userType: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.cpassword) {
      setError('Passwords do not match!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await authService.register({
        name: form.name,
        email: form.email,
        password: form.password,
        userType: form.userType,
      });
      const data = res.data.data;
      login(data);
      navigate(data.userType === 'admin' ? '/admin' : '/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--secondary)', display: 'flex', alignItems: 'center', padding: '2rem' }}>
      <div className="form-container" style={{ margin: '0 auto' }}>
        <h2>Create Account</h2>
        {error && (
          <div className="message error" style={{ position: 'static', marginBottom: '1rem' }}>
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Enter your name" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="Enter password" />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" name="cpassword" value={form.cpassword} onChange={handleChange} required placeholder="Confirm password" />
          </div>
          <div className="form-group">
            <label>Account Type</label>
            <select name="userType" value={form.userType} onChange={handleChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register Now'}
          </button>
        </form>
        <div className="links">
          <Link to="/login">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
