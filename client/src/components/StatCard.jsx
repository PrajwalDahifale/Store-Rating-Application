import React from 'react';
import styles from '../styles/dashboard.module.css';

export default function StatCard({ title, value, icon }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statLeft}>
        <div className={styles.statIcon}>{icon}</div>
        <div>
          <div className={styles.statTitle}>{title}</div>
          <div className={styles.statValue}>{value}</div>
        </div>
      </div>
    </div>
  );
}
