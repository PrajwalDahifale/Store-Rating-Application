import React, { useState } from 'react';
import RatingStars from './RatingStars';
import API from '../api';
import styles from './StoreCard.module.css';

export default function StoreCard({ store, onRatingSubmitted }) {
  const [myRating, setMyRating] = useState(store.user_rating || 0);
  const [comment, setComment] = useState('');

  const submit = async (rating) => {
    try {
      await API.post('/ratings', { store_id: store.id, rating, comment });
      setMyRating(rating);
      if (onRatingSubmitted) onRatingSubmitted();
      alert('Rating saved');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{store.name}</h3>
      <div className={styles.address}>{store.address}</div>
      <div className={styles.avgRating}>
        Avg rating: {Number(store.avg_rating).toFixed(2)} ({store.total_ratings} ratings)
      </div>
      <div className={styles.userRatingSection}>
        <div className={styles.userRatingLabel}>Your rating:</div>
        <RatingStars value={myRating} onChange={submit} />
        <textarea
          placeholder="Optional comment"
          value={comment}
          onChange={e => setComment(e.target.value)}
          className={styles.commentBox}
        />
      </div>
    </div>
  );
}
