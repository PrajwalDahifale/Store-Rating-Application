import React, { useEffect, useState } from 'react';
import API from '../api';
import styles from '../styles/modal.module.css';

export default function UserDetailModal({ user, onClose, refresh }){
  const [ownerRating, setOwnerRating] = useState(null);

  useEffect(()=> {
    async function fetchOwnerRating(){
      if (user.role !== 'owner') return;
      try {
        const res = await API.get('/admin/stores'); // fetch all stores with avg
        const stores = res.data.data || [];
        // compute average of averages for stores owned by this owner
        const owned = stores.filter(s => s.owner_id === user.id);
        if (owned.length === 0) { setOwnerRating({ avg: 0, total: 0 }); return; }
        const sumAvg = owned.reduce((acc, s) => acc + (parseFloat(s.avg_rating || 0) * (s.total_ratings || 0)), 0);
        const totalRatings = owned.reduce((acc, s) => acc + (s.total_ratings || 0), 0);
        const avg = totalRatings ? (sumAvg / totalRatings) : (owned.reduce((a,b)=>a + parseFloat(b.avg_rating || 0), 0)/owned.length);
        setOwnerRating({ avg: Number(avg).toFixed(2), total: totalRatings });
      } catch (err) { console.error(err); }
    }
    fetchOwnerRating();
  }, [user]);






  

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.head}>
          <h3>User details</h3>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>
        <div className={styles.body}>
          <div><strong>Name:</strong> {user.name}</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Address:</strong> {user.address}</div>
          <div><strong>Role:</strong> {user.role}</div>
          {user.role === 'owner' && ownerRating && (
            <div style={{marginTop:10}}>
              <strong>Owner rating:</strong> {ownerRating.avg} ({ownerRating.total} ratings)
            </div>

           

          )}
        </div>
        <div className={styles.actions}>
          <button onClick={()=>{ onClose(); refresh && refresh(); }} className={styles.primary}>Close</button>
        </div>
      </div>
    </div>
  );
}
