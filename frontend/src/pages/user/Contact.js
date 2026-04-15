import React, { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Toast from '../../components/common/Toast';
import { messageService } from '../../services/api';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', number: '', message: '' });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await messageService.send(form);
      setToast({ message: 'Message sent successfully!', type: 'success' });
      setForm({ name: '', email: '', number: '', message: '' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to send!', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ padding: '3rem 5%', maxWidth: '600px', margin: '0 auto' }}>
        <h2 className="section-title">Contact Us</h2>
        <div className="form-container" style={{ margin: '0 auto' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Name</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Enter your name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="Enter your email" />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} required placeholder="Enter phone number" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                required
                placeholder="Write your message..."
                rows="5"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', resize: 'vertical' }}
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
