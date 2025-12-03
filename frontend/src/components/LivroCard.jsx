import React, { useState, useEffect } from 'react';
import './LivroCard.css';
import ReviewList from './ReviewList'; 
import ReviewForm from './ReviewForm'; 
import { useAuth } from '../contexts/AuthContext';
import { favoritesService } from '../services/favoritesService';

const LivroCard = ({ livro, onEdit, onDelete, favoriteList, isFavorited: propIsFavorited, onFavoriteToggle }) => {
    
    const [showReviews, setShowReviews] = useState(false);
    const [reviewUpdateKey, setReviewUpdateKey] = useState(0);
    const { user } = useAuth(); 
    const [isFavorited, setIsFavorited] = useState(
        propIsFavorited !== undefined 
            ? propIsFavorited
            : favoriteList ? favoriteList.some(fav => fav.id === livro.id) : false
    );
    
    useEffect(() => {
        if (propIsFavorited !== undefined) {
            setIsFavorited(propIsFavorited);
        } else if (favoriteList) {
            setIsFavorited(favoriteList.some(fav => fav.id === livro.id));
        }
    }, [propIsFavorited, favoriteList, livro.id]);

    const handleFavoriteToggle = async () => {
        if (!user) {
            alert('Você precisa estar logado para favoritar um livro.');
            return;
        }

        try {
            if (isFavorited) {
                // Desfavoritar
                await favoritesService.removerFavorito(livro.id);
                alert(`"${livro.titulo}" removido dos favoritos!`);
            } else {
                // Favoritar
                await favoritesService.adicionarFavorito(livro.id);
                alert(`"${livro.titulo}" adicionado aos favoritos!`);
            }
            
            setIsFavorited(!isFavorited);
            if (onFavoriteToggle) {
                onFavoriteToggle(); 
            }

        } catch (error) {
            console.error('Erro ao alternar favorito:', error);
            alert('Falha ao atualizar favoritos.');
        }
    };

    const handleReviewPosted = () => {
        setReviewUpdateKey(prev => prev + 1);
        setShowReviews(true); 
    };

    const toggleReviews = () => {
        setShowReviews(!showReviews);
    };

    const handleDeleteClick = () => {
        if (window.confirm(`Tem certeza que deseja remover o livro "${livro.titulo}"?`)) {
            onDelete(livro.id);
        }
    };

    return (
        <div className="livro-card-wrapper">
            <div className="livro-card">
                <h3>{livro.titulo}</h3>
                <p><strong>Autor:</strong> {livro.autor}</p>
                <p><strong>Ano:</strong> {livro.ano}</p>
                {livro.editora && <p><strong>Editora:</strong> {livro.editora}</p>}
                
                <div className="card-actions">

                    {user && ( 
                        <button 
                            onClick={handleFavoriteToggle} 
                            className={`btn btn-favorite ${isFavorited ? 'favorited' : ''}`}
                            title={isFavorited ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                        >
                            {isFavorited ? '❤️ Favorito' : '🤍 Favoritar'}
                        </button>
                    )}

                    <button onClick={() => onEdit(livro)} className="btn btn-primary">
                        ✏️ Editar
                    </button>
                    <button onClick={handleDeleteClick} className="btn btn-danger">
                        🗑️ Remover
                    </button>
                </div>
                
                <button 
                    onClick={toggleReviews} 
                    className="btn btn-secondary toggle-reviews-btn"
                >
                    {showReviews ? '▲ Ocultar Reviews' : '▼ Ver Reviews'}
                </button>
            </div>

            {showReviews && (
                <div className="reviews-section">
                    
                    <ReviewForm 
                        livroId={livro.id} 
                        onReviewPosted={handleReviewPosted}
                    />
                    <ReviewList 
                        key={reviewUpdateKey}
                        livroId={livro.id}
                        onReviewPosted={handleReviewPosted} 
                    />
                </div>
            )}
        </div>
    );
};

export default LivroCard;