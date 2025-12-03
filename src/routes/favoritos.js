const express = require('express');
const router = express.Router();
const { run, all } = require('../database/sqlite'); 
const { requireAuth } = require('../middlewares/auth'); 

// 1. POST /api/favoritos - Adicionar um livro aos favoritos
router.post('/', requireAuth, async (req, res) => {
    const { livro_id } = req.body;
    const user_id = req.session.userId; 
    
    if (!livro_id) {
        return res.status(400).json({ message: 'O ID do livro é obrigatório.' });
    }

    const sql = 'INSERT INTO favorites (user_id, livro_id) VALUES (?, ?)';
    try {
        await run(sql, [user_id, livro_id]); 
        res.status(201).json({ message: 'Livro favoritado com sucesso!' });
    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(200).json({ message: 'Livro já está nos seus favoritos.' });
        }
        console.error("Erro ao favoritar livro:", err.message);
        return res.status(500).json({ message: 'Erro interno ao favoritar o livro.' });
    }
});

// 2. DELETE /api/favoritos/:livroId - Remover um livro dos favoritos
router.delete('/:livroId', requireAuth, async (req, res) => {
    const livro_id = req.params.livroId;
    const user_id = req.session.userId;

    const sql = 'DELETE FROM favorites WHERE user_id = ? AND livro_id = ?';
    try {
        const result = await run(sql, [user_id, livro_id]); 
        
        if (result.changes && result.changes === 0) {
             return res.status(404).json({ message: 'Livro não encontrado nos favoritos.' });
        }
        
        res.status(200).json({ message: 'Livro removido dos favoritos com sucesso!' });
    } catch (err) {
        console.error("Erro ao desfavoritar livro:", err.message);
        return res.status(500).json({ message: 'Erro interno ao desfavoritar o livro.' });
    }
});

// 3. GET /api/favoritos - Listar todos os livros favoritos do usuário logado
router.get('/', requireAuth, async (req, res) => {
    const user_id = req.session.userId;
    
    // Junta a tabela favoritos com a tabela livros para obter os dados completos dos livros
    const sql = `
        SELECT l.* FROM favorites f
        JOIN livros l ON f.livro_id = l.id
        WHERE f.user_id = ?
        ORDER BY l.titulo ASC
    `;
    
    try {
        const favoritos = await all(sql, [user_id]);
        res.json(favoritos);
    } catch (err) {
        console.error("Erro ao listar favoritos:", err.message);
        return res.status(500).json({ message: 'Erro interno ao listar favoritos.' });
    }
});

module.exports = router;