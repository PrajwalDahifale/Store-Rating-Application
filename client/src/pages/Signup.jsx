import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import './signup.css';

const PASSWORD_REGEX = /^(?=.{8,16}$)(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>\/?\\|]).+$/;

export default function Signup(){
  const [form, setForm] = useState({ name:'', email:'', address:'', password:'' });
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    if (form.name.length < 10 || form.name.length > 60) return setErr('Name must be 10-60 characters');
    if (form.address.length > 400) return setErr('Address max 400 characters');
    if (!PASSWORD_REGEX.test(form.password)) return setErr('Password invalid: 8-16 chars, uppercase & special');
    try {
      await API.post('/auth/signup', form);
      alert('Signup successful, login now');
      navigate('/login');
    } catch (err) {
      setErr(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={submit} className="signup-card">
        <h2 className="signup-title">Create Your Account</h2>

        <input
          className="signup-input"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="signup-input"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <textarea
          className="signup-textarea"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <input
          type="password"
          className="signup-input"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button type="submit" className="signup-button">Sign Up</button>

        {err && <div className="signup-error">{err}</div>}
      </form>
    </div>
  );
}
