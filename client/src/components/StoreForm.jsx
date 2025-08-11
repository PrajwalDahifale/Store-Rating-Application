import React, { useState } from 'react';
import API from '../api';
import styles from '../styles/form.module.css';

export default function StoreForm({ onSuccess }){
  const [form, setForm] = useState({ name:'', email:'', address:'', owner_id:'' });
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      await API.post('/stores', form);
      setForm({ name:'', email:'', address:'', owner_id:'' });
      onSuccess && onSuccess();
    } catch (err) {
      setErr(err.response?.data?.message || 'Error creating store');
    }
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.row}><label>Name</label><input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required /></div>
      <div className={styles.row}><label>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} /></div>
      <div className={styles.row}><label>Address</label><input value={form.address} onChange={e=>setForm({...form, address:e.target.value})} /></div>
      <div className={styles.row}><label>Owner ID</label><input value={form.owner_id} onChange={e=>setForm({...form, owner_id:e.target.value})} required /></div>
      {err && <div className={styles.error}>{err}</div>}
      <div className={styles.actions}><button className={styles.primary}>Create Store</button></div>
    </form>
  );
}
