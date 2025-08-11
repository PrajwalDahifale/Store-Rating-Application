import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import styles from '../styles/header.module.css';
import { Link } from "react-router-dom";

export default function Header(){
  const { user, logout } = useContext(AuthContext);
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        {/* <div className={styles.subtitle}>Admin Panel</div> */}
      </div>
      <div className={styles.controls}>
        {user ? (
          <div className={styles.user}>
            <div className={styles.username}>{user.name || user?.email}</div>
            <button className={styles.logout} onClick={logout}>Logout</button>
            <Link to="/change-password">
  <button className={styles.logout} >Change Password</button>
</Link>
          </div>

          
        ) : (
          <div className={styles.user}>
            <div className={styles.username}>Admin</div>
          </div>
        )}
      </div>
    </header>
  );
}
