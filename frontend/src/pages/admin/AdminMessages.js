import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Toast from '../../components/common/Toast';
import { messageService } from '../../services/api';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [toast, setToast] = useState(null);

  const fetchMessages = () => {
    messageService.getAll()
      .then(res => setMessages(res.data.data || []))
      .catch(() => {});
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await messageService.delete(id);
      setToast({ message: 'Message deleted!', type: 'success' });
      fetchMessages();
    } catch {
      setToast({ message: 'Delete failed!', type: 'error' });
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <h1>Customer Messages</h1>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#777' }}>No messages yet</td></tr>
            ) : messages.map((msg, i) => (
              <tr key={msg.id}>
                <td>{i + 1}</td>
                <td>{msg.name}</td>
                <td>{msg.email}</td>
                <td>{msg.number}</td>
                <td style={{ maxWidth: '300px' }}>{msg.message}</td>
                <td>
                  <button className="product_btn product_del_btn" onClick={() => handleDelete(msg.id)}>
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default AdminMessages;
