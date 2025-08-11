import React, { useState } from 'react';
import API from '../api';
import './ChangePassword.css'; 

export default function ChangePassword() {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '' });
  const [msg, setMsg] = useState(null);

  const submit = async e => {
    e.preventDefault();
    try {
      await API.put('/auth/password', form);
      setMsg('✅ Password updated successfully!');
    } catch (err) {
      setMsg(`❌ ${err.response?.data?.message || 'Error updating password'}`);
    }
  };

  return (
    <div className="change-password-container">
      <h2 className="change-password-title">Change Your Password</h2>
      <form className="change-password-form" onSubmit={submit}>
        <input
          type="password"
          placeholder="Old password"
          value={form.oldPassword}
          onChange={e => setForm({ ...form, oldPassword: e.target.value })}
          className="input-field"
          required
        />
        <input
          type="password"
          placeholder="New password"
          value={form.newPassword}
          onChange={e => setForm({ ...form, newPassword: e.target.value })}
          className="input-field"
          required
        />
        <button type="submit" className="submit-btn">
          Change Password
        </button>
        {msg && <div className="message">{msg}</div>}
      </form>
    </div>
  );
}
