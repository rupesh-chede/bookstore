import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="admin-sidebar">
      <div className="brand">
        <i className="fas fa-book-open"></i> Admin Panel
      </div>
      <p style={{ color: 'rgba(255,255,255,0.5)', padding: '0 1.5rem 1rem', fontSize: '0.85rem' }}>
        Welcome, {user?.name}
      </p>
      <NavLink to="/admin" end><i className="fas fa-tachometer-alt"></i> Dashboard</NavLink>
      <NavLink to="/admin/products"><i className="fas fa-boxes"></i> Products</NavLink>
      <NavLink to="/admin/orders"><i className="fas fa-shopping-bag"></i> Orders</NavLink>
      <NavLink to="/admin/messages"><i className="fas fa-envelope"></i> Messages</NavLink>
      <NavLink to="/admin/users"><i className="fas fa-users"></i> Users</NavLink>
      <button
        onClick={handleLogout}
        style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)',
          cursor: 'pointer', padding: '0.85rem 1.5rem', display: 'flex',
          alignItems: 'center', gap: '0.8rem', width: '100%', fontSize: '0.95rem',
          marginTop: 'auto'
        }}
      >
        <i className="fas fa-sign-out-alt"></i> Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
