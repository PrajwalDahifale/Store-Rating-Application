import React, { useEffect, useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../contexts/AuthContext';
import "./ownerDashboard.css";

export default function OwnerDashboard(){
  const { user } = useContext(AuthContext);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    // list stores and filter by owner - backend admin endpoint can be created; simpler: fetch all stores and filter client-side
    API.get('/stores').then(res => {
        
      const mine = res.data.data.filter(s => s.owner_id === user.id);
      setStores(mine);
      
    }).catch(console.error);
  }, []);

  
  return (
    <div className="owner-dashboard">
    <h2 className="dashboard-title">Owner Dashboard</h2>
    <div className="store-list">
      {stores.map(s => (
        <div className="store-card" key={s.id}>
          <h3>{s.name}</h3>
          <p>Avg rating: {Number(s.avg_rating).toFixed(2)}</p>
          <a href={`/owner/store/${s.id}`} className="view-link">View Ratings</a>
        </div>
      ))}
    </div>
  </div>
  );
}
