import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../styles/sidebar.module.css';

export default function Sidebar(){
  return (
    <aside className={styles.sidebar}>
      <nav>
        <NavLink to="/admin/dashboard" className={({isActive})=>isActive?styles.active:styles.link}>Dashboard</NavLink>
        <NavLink to="/admin/users" className={({isActive})=>isActive?styles.active:styles.link}>Users</NavLink>
        <NavLink to="/admin/stores" className={({isActive})=>isActive?styles.active:styles.link}>Stores</NavLink>
      </nav>
      <div className={styles.footer}>© {new Date().getFullYear()} StoreRatings</div>
    </aside>
  )
}
