// frontend/src/components/ReviewForm.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; 
import './ReviewForm.css'; 

const ReviewForm = ({ livroId, onReviewPosted }) => {
    const { user } = useAuth();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    if (!user) {
        return (
            <div className="review-form-message">
                <p>Faça <a href="/login">login</a> para deixar sua avaliação!</p>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        const token = localStorage.getItem('token'); 

        if (!token) {
            setError('Usuário não autenticado. Por favor, faça login novamente.');
            setSubmitting(false);
            return;
        }

        try {
            await axios.post(
                '/api/reviews', 
                { 
                    livro_id: livroId, 
                    rating: parseInt(rating), 
                    comment 
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}` 
                    }
                }
            );
            
            setComment('');
            setRating(5);
            setSuccess(true);

            if (onReviewPosted) {
                onReviewPosted();
            }

        } catch (err) {
            console.error('Erro ao enviar review:', err.response ? err.response.data : err.message);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message); 
            } else {
                setError('Falha ao enviar review. Verifique se todos os campos estão corretos.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="review-form-container">
            <h4>Deixe sua Avaliação</h4>
            
            {success && <p className="success-message">Avaliação enviada com sucesso!</p>}
            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="rating">Nota (0 a 5):</label>
                    <input 
                        type="number" 
                        id="rating"
                        min="0" 
                        max="5" 
                        value={rating} 
                        onChange={(e) => setRating(e.target.value)} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="comment">Comentário (opcional, máx. 500 caracteres):</label>
                    <textarea 
                        id="comment"
                        value={comment} 
                        onChange={(e) => setComment(e.target.value)} 
                        maxLength="500"
                        rows="3"
                        placeholder="Escreva sua opinião sobre o livro..."
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={submitting}
                >
                    {submitting ? 'Enviando...' : 'Enviar Avaliação'}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;