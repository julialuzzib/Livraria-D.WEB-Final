import React, { useState, useEffect, useCallback } from 'react';
import LivroCard from '../components/LivroCard';
import { favoritesService } from '../services/favoritesService';
import { useAuth } from '../contexts/AuthContext'; 
import './Livros.css'; 

const Favoritos = () => {
    const { user, loading: authLoading } = useAuth();
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const carregarFavoritos = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError('');
            const data = await favoritesService.listarFavoritos();
            setFavoritos(data);
        } catch (err) {
            setError('Erro ao carregar livros favoritos.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!authLoading) {
            carregarFavoritos();
        }
    }, [authLoading, carregarFavoritos]);

    const handleFavoriteToggle = () => {
        carregarFavoritos();
    };


    if (authLoading || loading) {
        return <div className="loading">Carregando favoritos...</div>;
    }
    
    if (!user) {
        return (
            <div className="container">
                <h1>Meus Favoritos</h1>
                <p>Por favor, faça <a href="/login">login</a> para ver seus livros favoritos.</p>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="livros-header">
                <h1>Meus Favoritos</h1>
            </div>

            {error && (
                <div className="alert alert-error">{error}</div>
            )}

            {favoritos.length === 0 ? (
                <div className="empty-state">
                    <p>Você ainda não favoritou nenhum livro. Volte para a lista de livros para adicionar!</p>
                </div>
            ) : (
                <div className="livros-grid">
                    {favoritos.map((livro) => (
                        <LivroCard
                            key={livro.id}
                            livro={livro}
                            favoriteList={favoritos} 
                            onFavoriteToggle={handleFavoriteToggle} 
                            onEdit={() => alert("Edição desabilitada na página de favoritos.")}
                            onDelete={() => alert("Remoção desabilitada na página de favoritos.")}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favoritos;