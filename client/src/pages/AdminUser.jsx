import React, { useEffect, useState } from 'react';
import API from '../api';
import styles from '../styles/table.module.css';
import formStyles from '../styles/form.module.css';
import UserForm from '../components/UserForm';
import UserDetailModal from '../components/UserDetailModal';

export default function AdminUsers(){
  const [filters, setFilters] = useState({ name:'', email:'', address:'', role:'' });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
 
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("showForm") === "true") {
      setShowForm(true);
    }
  }, []);
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/users', { params: { ...filters, sortField, sortDir } });
      setUsers(res.data.data || []);
    } catch(err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(()=>{ fetchUsers(); }, []);

  const onFilter = () => { fetchUsers(); };
  const onCreateSuccess = () => { setShowForm(false); fetchUsers(); };

  return (
    <div className={formStyles.page}>
      <div className={formStyles.headerRow}>
        <h1>Manage Users</h1>
        <div>
          <button className={formStyles.primary} onClick={()=>setShowForm(!showForm)}>{showForm ? 'Close' : 'Add User'}</button>
        </div>
      </div>

      {showForm && <div className={formStyles.card}><UserForm onSuccess={onCreateSuccess} /></div>}

     


      <div className={formStyles.filters}>
        <input placeholder="Name" value={filters.name} onChange={e=>setFilters({...filters, name:e.target.value})} />
        <input placeholder="Email" value={filters.email} onChange={e=>setFilters({...filters, email:e.target.value})} />
        <input placeholder="Address" value={filters.address} onChange={e=>setFilters({...filters, address:e.target.value})} />
        <select value={filters.role} onChange={e=>setFilters({...filters, role:e.target.value})}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="owner">Owner</option>
        </select>
        <button className={formStyles.secondary} onClick={onFilter}>Apply</button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={()=>{ setSortField('name'); setSortDir(sortDir==='asc'?'desc':'asc'); fetchUsers(); }}>Name</th>
              <th onClick={()=>{ setSortField('email'); setSortDir(sortDir==='asc'?'desc':'asc'); fetchUsers(); }}>Email</th>
              <th>Address</th>
              <th onClick={()=>{ setSortField('role'); setSortDir(sortDir==='asc'?'desc':'asc'); fetchUsers(); }}>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={5}>Loading...</td></tr> :
              users.length===0 ? <tr><td colSpan={5}>No users found</td></tr> :
              users.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td className={styles.muted}>{u.address}</td>
                  <td>{u.role}</td>
                  <td>
                    <button className={formStyles} onClick={()=>setSelectedUser(u)}>View</button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {selectedUser && <UserDetailModal user={selectedUser} onClose={()=>setSelectedUser(null)} refresh={fetchUsers} />}
    </div>
  );
}
