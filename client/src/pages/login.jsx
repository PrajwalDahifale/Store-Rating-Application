import React, { useState, useContext } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './login.css';

export default function Login(){
  const [form, setForm] = useState({ email:'', password:'' });
  const [err, setErr] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', form);
      login(data.token, data.user);
      // redirect by role
      if (data.user.role === 'admin') navigate('/admin/dashboard');
      else if (data.user.role === 'owner') navigate('/owner/dashboard');
      else navigate('/stores');
    } catch (err) {
      setErr(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
    <form onSubmit={submit} className="login-card">
      <h2 className="login-title">Login</h2>
      <input
        className="login-input"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        className="login-input"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit" className="login-button">Login</button>
      {err && <div className="login-error">{err}</div>}
    </form>
  </div>
  );
}
