import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Toast from '../../components/common/Toast';
import { orderService } from '../../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState(null);

  const fetchOrders = () => {
    orderService.getAllOrders()
      .then(res => setOrders(res.data.data || []))
      .catch(() => {});
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await orderService.updateStatus(id, status);
      setToast({ message: 'Status updated!', type: 'success' });
      fetchOrders();
    } catch {
      setToast({ message: 'Update failed!', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await orderService.deleteOrder(id);
      setToast({ message: 'Order deleted!', type: 'success' });
      fetchOrders();
    } catch {
      setToast({ message: 'Delete failed!', type: 'error' });
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <h1>Manage Orders</h1>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Products</th>
                <th>Total</th>
                <th>Method</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#777' }}>No orders yet</td></tr>
              ) : orders.map((order, i) => (
                <tr key={order.id}>
                  <td>{i + 1}</td>
                  <td>
                    <strong>{order.name}</strong><br />
                    <small style={{ color: '#777' }}>{order.email}</small>
                  </td>
                  <td>{order.number}</td>
                  <td style={{ maxWidth: '200px', fontSize: '0.85rem' }}>{order.totalProducts}</td>
                  <td><strong>Rs. {order.totalPrice}/-</strong></td>
                  <td>{order.method}</td>
                  <td>{order.placedOn}</td>
                  <td>
                    <select
                      value={order.paymentStatus}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                      style={{
                        padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #ddd',
                        background: order.paymentStatus === 'pending' ? '#fef3cd' : '#d1e7dd',
                        color: order.paymentStatus === 'pending' ? '#856404' : '#0f5132',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td>
                    <button className="product_btn product_del_btn" onClick={() => handleDelete(order.id)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;
