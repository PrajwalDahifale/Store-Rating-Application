import React, { useEffect, useState, useContext } from 'react';
import API from '../api';
import StoreCard from '../components/StoreCard';
import { AuthContext } from '../contexts/AuthContext';

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [qName, setQName] = useState('');
  const [qAddress, setQAddress] = useState('');
  const [page, setPage] = useState(1);
  const { user } = useContext(AuthContext);

  const fetchStores = async () => {
    const res = await API.get('/stores', { params: { qName, qAddress, page } });
    setStores(res.data.data);
  };

  useEffect(() => { fetchStores(); }, [page]);

  return (
    <div>
      <h2>Stores</h2>
      <div
  style={{
    display: 'flex',
    gap: 12,
    marginBottom: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
  }}
>
  <input
    placeholder="Search name"
    value={qName}
    onChange={e => setQName(e.target.value)}
    style={{
      flex: '1 1 200px',
      padding: '10px 14px',
      borderRadius: 8,
      border: '1px solid #ddd',
      fontSize: 16,
      fontFamily: "'Segoe UI', sans-serif",
      color: '#1F2937',
      outline: 'none',
      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    }}
    onFocus={e => {
      e.target.style.borderColor = '#2563EB';
      e.target.style.boxShadow = '0 0 6px rgba(37, 99, 235, 0.5)';
    }}
    onBlur={e => {
      e.target.style.borderColor = '#ddd';
      e.target.style.boxShadow = 'none';
    }}
  />
  <input
    placeholder="Search address"
    value={qAddress}
    onChange={e => setQAddress(e.target.value)}
    style={{
      flex: '1 1 200px',
      padding: '10px 14px',
      borderRadius: 8,
      border: '1px solid #ddd',
      fontSize: 16,
      fontFamily: "'Segoe UI', sans-serif",
      color: '#1F2937',
      outline: 'none',
      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    }}
    onFocus={e => {
      e.target.style.borderColor = '#2563EB';
      e.target.style.boxShadow = '0 0 6px rgba(37, 99, 235, 0.5)';
    }}
    onBlur={e => {
      e.target.style.borderColor = '#ddd';
      e.target.style.boxShadow = 'none';
    }}
  />
  <button
    onClick={() => {
      setPage(1);
      fetchStores();
    }}
    style={{
      backgroundColor: '#F97316',
      color: 'white',
      padding: '10px 22px',
      border: 'none',
      borderRadius: 8,
      fontSize: 16,
      fontWeight: 600,
      cursor: 'pointer',
      fontFamily: "'Segoe UI', sans-serif",
      transition: 'background-color 0.3s ease, transform 0.1s ease',
    }}
    onMouseEnter={e => {
      e.target.style.backgroundColor = '#D65B0D';
      e.target.style.transform = 'scale(1.05)';
    }}
    onMouseLeave={e => {
      e.target.style.backgroundColor = '#F97316';
      e.target.style.transform = 'none';
    }}
  >
    Search
  </button>
</div>

      <div>
        {stores.map(s => <StoreCard store={s} key={s.id} onRatingSubmitted={() => fetchStores()} />)}
      </div>
      <div>
        <button onClick={() => setPage(Math.max(1, page-1))}>Prev</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page+1)}>Next</button>
      </div>
    </div>
  );
}
