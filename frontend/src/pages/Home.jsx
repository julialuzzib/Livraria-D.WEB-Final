import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container">
      <div className="home-container">
        <div className="welcome-card">
          <h1>Bem-vindo ao Sistema de Gerenciamento de Livraria! 📚</h1>
          <p className="subtitle">
            Olá, <strong>{user?.username || user?.email}</strong>!
          </p>
          <p>Sistema completo para gerenciar sua coleção de livros.</p>

          <div className="cta">
            <Link to="/livros" className="btn btn-primary btn-large">
              Ver Meus Livros
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;