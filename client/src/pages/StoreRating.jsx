import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import styles from "./StoreRatings.module.css";

function StoreRatings() {
  const { id } = useParams();
  const [ratings, setRatings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get(`/ratings/store/${id}`)
      .then((res) => {
        if (!res.data || !res.data.ratings) {
          throw new Error("No ratings found");
        }
        setRatings(res.data.ratings);
        setSummary(res.data.summary);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className={styles.noRatings}>Loading ratings...</p>;
  if (error) return <p className={styles.noRatings} style={{ color: "#F97316" }}>{error}</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Store Ratings</h2>

      {summary && (
        <div className={styles.summary}>
          <div>
            <strong>Average Rating:</strong>{" "}
            <span style={{ color: "#F97316" }}>⭐ {summary.avg_rating}</span>
          </div>
          <div>
            <strong>Total Ratings:</strong> {summary.total_ratings}
          </div>
        </div>
      )}

      {ratings.length > 0 ? (
        <ul className={styles.ratingList}>
          {ratings.map((r) => (
            <li key={r.id} className={styles.ratingItem}>
              <span className={styles.userName}>{r.user_name}</span>
              <span className={styles.ratingStars}> — ⭐ {r.rating}</span>
              <div className={styles.comment}>{r.comment || "No comment provided"}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noRatings}>No ratings found.</p>
      )}
    </div>
  );
}

export default StoreRatings;
