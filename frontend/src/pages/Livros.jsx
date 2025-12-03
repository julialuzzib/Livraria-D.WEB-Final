import React, { useState, useEffect, useCallback } from 'react';
import { livrosService } from '../services/livrosService';
import { favoritesService } from '../services/favoritesService'; 
import { useAuth } from '../contexts/AuthContext';
import LivroCard from '../components/LivroCard';
import LivroForm from '../components/LivroForm';
import './Livros.css';

const Livros = () => {
  const { user } = useAuth();
  const [livros, setLivros] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingLivro, setEditingLivro] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const carregarFavoritos = useCallback(async () => {
    if (!user) {
      setFavoritos([]);
      return;
    }
    try {
      const data = await favoritesService.listarFavoritos();
      setFavoritos(data.map(f => f.id));
    } catch (err) {
      console.error('Erro ao carregar favoritos:', err);
    }
  }, [user]);


  useEffect(() => {
    carregarLivros();
    carregarFavoritos(); 
  }, [carregarFavoritos]);

  useEffect(() => {
    carregarLivros();
  }, []);

  const carregarLivros = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await livrosService.listar();
      setLivros(data);
    } catch (err) {
      setError('Erro ao carregar livros.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingLivro(null);
    setShowForm(true);
  };

  const handleEdit = (livro) => {
    setEditingLivro(livro);
    setShowForm(true);
  };

  const handleDelete = async (id) => {

    try {
      await livrosService.remover(id);
      showSuccess('Livro removido com sucesso!');
      carregarLivros();
    } catch (err) {
      setError('Erro ao remover livro.');
      console.error(err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingLivro) {
        await livrosService.atualizar(editingLivro.id, formData);
        showSuccess('Livro atualizado com sucesso!');
      } else {
        await livrosService.criar(formData);
        showSuccess('Livro criado com sucesso!');
      }
      setShowForm(false);
      setEditingLivro(null);
      carregarLivros();
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao salvar livro.');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingLivro(null);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (loading) {
    return <div className="loading">Carregando livros...</div>;
  }

  return (
    <div className="container">
      <div className="livros-header">
        <h1>Meus Livros</h1>
        <button onClick={handleCreate} className="btn btn-primary">
          ➕ Adicionar Livro
        </button>
      </div>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {livros.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum livro cadastrado ainda.</p>
          <button onClick={handleCreate} className="btn btn-primary">
            Adicionar seu primeiro livro
          </button>
        </div>
      ) : (
        <div className="livros-grid">
          {livros.map((livro) => (
            <LivroCard
              key={livro.id}
              livro={livro}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isFavorited={favoritos.includes(livro.id)}
              onFavoriteToggle={carregarFavoritos}
            />
          ))}
        </div>
      )}

      {showForm && (
        <LivroForm
          livro={editingLivro}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default Livros;