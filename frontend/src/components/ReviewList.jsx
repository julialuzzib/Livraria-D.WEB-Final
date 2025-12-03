// frontend/src/components/ReviewList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReviewList.css'; 

const ReviewList = ({ livroId, onReviewPosted }) => {
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReviews = async () => {
        if (!livroId) return; 
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/api/reviews/${livroId}`);
            const fetchedReviews = response.data;
            setReviews(fetchedReviews);

            if (fetchedReviews.length > 0) {
                const sum = fetchedReviews.reduce((acc, review) => acc + review.rating, 0);
                setAverageRating((sum / fetchedReviews.length).toFixed(1)); 
            } else {
                setAverageRating(null);
            }
        } catch (err) {
            console.error('Erro ao carregar reviews:', err);
            setError('Falha ao carregar as avaliações. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [livroId, onReviewPosted]); 

    const renderStars = (rating) => {
        const fullStars = '⭐'.repeat(rating);
        const emptyStars = '☆'.repeat(5 - rating);
        return fullStars + emptyStars;
    };

    if (loading) {
        return <p>Carregando avaliações...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }
    
    return (
        <div className="review-list-container">
            <h3>Avaliações</h3>
            
            <div className="average-rating">
                {averageRating !== null ? (
                    <>
                        <p>Média: <strong>{averageRating} / 5</strong></p>
                        <p>Baseado em {reviews.length} avaliação(ões).</p>
                    </>
                ) : (
                    <p>Seja o primeiro a avaliar este livro!</p>
                )}
            </div>
            
            <div className="reviews-feed">
                {reviews.map(review => (
                    <div key={review.id} className="review-card">
                        <div className="review-header">
                            <span className="review-username">{review.username}</span>
                            <span className="review-date">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="review-rating">
                            <span className="rating-number">{review.rating}</span>
                            <span className="star-icons">{renderStars(review.rating)}</span>
                        </div>
                        <p className="review-comment">"{review.comment}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewList;