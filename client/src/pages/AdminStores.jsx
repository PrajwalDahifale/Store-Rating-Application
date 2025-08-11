import React, { useEffect, useState } from 'react';
import API from '../api';
import styles from '../styles/table.module.css';
import formStyles from '../styles/form.module.css';
import StoreForm from '../components/StoreForm';

export default function AdminStores(){
  const [filters, setFilters] = useState({ qName:'', qAddress:'' });
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/stores', { params: { qName: filters.qName, qAddress: filters.qAddress }});
      setStores(res.data.data || []);
    } catch(err){ console.error(err); } finally { setLoading(false); }
  };

  useEffect(()=>{ fetchStores(); }, []);

  return (
    <div className={formStyles.page}>
      <div className={formStyles.headerRow}>
        <h1>Manage Stores</h1>
        <div><button className={formStyles.primary} onClick={()=>setShowForm(!showForm)}>{showForm?'Close':'Add Store'}</button></div>
      </div>

      {showForm && <div className={formStyles.card}><StoreForm onSuccess={()=>{ setShowForm(false); fetchStores(); }} /></div>}

      <div className={formStyles.filters}>
        <input placeholder="Name" value={filters.qName} onChange={e=>setFilters({...filters, qName:e.target.value})} />
        <input placeholder="Address" value={filters.qAddress} onChange={e=>setFilters({...filters, qAddress:e.target.value})} />
        <button className={formStyles.secondary} onClick={fetchStores}>Search</button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Address</th><th>Avg Rating</th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={4}>Loading...</td></tr> :
              stores.length===0 ? <tr><td colSpan={4}>No stores</td></tr> :
              stores.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td className={styles.muted}>{s.address}</td>
                  <td>{Number(s.avg_rating || 0).toFixed(2)}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
