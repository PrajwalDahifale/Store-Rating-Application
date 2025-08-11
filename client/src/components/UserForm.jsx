import React, { useState } from 'react';
import API from '../api';
import styles from '../styles/form.module.css';

export default function UserForm({ onSuccess }){
  const [form, setForm] = useState({ name:'', email:'', password:'', address:'', role:'user' });
  const [err, setErr] = useState(null);
  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      await API.post('/admin/users', form);
      setForm({ name:'', email:'', password:'', address:'', role:'user' });
      onSuccess && onSuccess();
    } catch (err) {
      setErr(err.response?.data?.message || 'Error creating user');
    }
  };
  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.row}><label>Name</label><input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required /></div>
      <div className={styles.row}><label>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required /></div>
      <div className={styles.row}><label>Address</label><input value={form.address} onChange={e=>setForm({...form, address:e.target.value})} /></div>
      <div className={styles.row}><label>Password</label><input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required /></div>
      <div className={styles.row}><label>Role</label>
        <select value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
        </select>
      </div>
      {err && <div className={styles.error}>{err}</div>}
      <div className={styles.actions}><button className={styles.primary}>Create</button></div>
    </form>
  );
}
