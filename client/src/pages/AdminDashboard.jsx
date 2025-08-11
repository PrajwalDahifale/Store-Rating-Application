import React, { useEffect, useState } from 'react';
import API from '../api';
import StatCard from '../components/StatCard';
import styles from '../styles/dashboard.module.css';

export default function AdminDashboard(){
  
  const [summary, setSummary] = useState({ total_users:0, total_stores:0, total_ratings:0 });
  useEffect(()=>{
    API.get('/admin/dashboard').then(res => setSummary(res.data)).catch(err => {
      console.error(err);
      // handle unauthorized / show message
  
    });
  }, []);
  //  <Header />
  return (
    
    <div className={styles.page}>
      
      <h1 className={styles.h1}>Admin Dashboard</h1>
      <div className={styles.grid}>
        
        <StatCard title="Total Users" value={summary.total_users} icon="👥" />
        <StatCard title="Total Stores" value={summary.total_stores} icon="🏬" />
        <StatCard title="Total Ratings" value={summary.total_ratings} icon="⭐" />
      </div>
      
      <section className={styles.section}>
        <h2>Quick Actions</h2>
        <div className={styles.quickActions}>
          <a className={styles.actionBtn} href="/admin/users">Manage Users</a>
          <a className={styles.actionBtn} href="/admin/stores">Manage Stores</a>
        </div>
      </section>
    </div>
  );
}
