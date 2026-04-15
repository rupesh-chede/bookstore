import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { productService, orderService, messageService } from '../../services/api';

const StatCard = ({ icon, label, value, color }) => (
  <div style={{
    background: 'white', borderRadius: '12px', padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)', display: 'flex',
    alignItems: 'center', gap: '1.5rem'
  }}>
    <div style={{
      width: '60px', height: '60px', borderRadius: '12px', background: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontSize: '1.5rem'
    }}>
      <i className={icon}></i>
    </div>
    <div>
      <p style={{ color: '#777', fontSize: '0.9rem' }}>{label}</p>
      <h2 style={{ fontSize: '2rem', color: '#333' }}>{value}</h2>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, messages: 0, revenue: 0 });

  useEffect(() => {
    Promise.all([
      productService.getAll(),
      orderService.getAllOrders(),
      messageService.getAll(),
    ]).then(([products, orders, messages]) => {
      const orderList = orders.data.data || [];
      const revenue = orderList.reduce((sum, o) => sum + o.totalPrice, 0);
      setStats({
        products: products.data.data?.length || 0,
        orders: orderList.length,
        messages: messages.data.data?.length || 0,
        revenue,
      });
    }).catch(() => {});
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <h1>Dashboard</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
          <StatCard icon="fas fa-boxes" label="Total Products" value={stats.products} color="#8B5E3C" />
          <StatCard icon="fas fa-shopping-bag" label="Total Orders" value={stats.orders} color="#2ecc71" />
          <StatCard icon="fas fa-envelope" label="Messages" value={stats.messages} color="#3498db" />
          <StatCard icon="fas fa-rupee-sign" label="Total Revenue" value={`₹${stats.revenue}`} color="#e74c3c" />
        </div>

        <div style={{ marginTop: '2rem', background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
          <h3 style={{ marginBottom: '1rem', color: '#555' }}>Quick Links</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { to: '/admin/products', label: 'Manage Products', icon: 'fas fa-plus' },
              { to: '/admin/orders', label: 'View Orders', icon: 'fas fa-list' },
              { to: '/admin/messages', label: 'View Messages', icon: 'fas fa-envelope-open' },
            ].map(link => (
              <a key={link.to} href={link.to} className="product_btn">
                <i className={link.icon} style={{ marginRight: '0.5rem' }}></i>{link.label}
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
