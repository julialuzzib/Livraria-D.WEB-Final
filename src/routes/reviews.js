//src/routes/reviews.js
const express = require('express');
const router = express.Router();
const { run, all } = require('../database/sqlite'); 
const { requireAuth } = require('../middlewares/auth'); 
const { body, validationResult } = require('express-validator'); 

const validateReview = [
    body('livro_id').isInt().withMessage('O ID do livro é inválido.'),
    body('rating').isInt({ min: 0, max: 5 }).withMessage('A nota deve ser entre 0 e 5.'),
    body('comment').optional().isLength({ max: 500 }).withMessage('O comentário deve ter no máximo 500 caracteres.'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Se houver erros de validação, retorna 400
            return res.status(400).json({ errors: errors.array() });
        }
        next(); 
    }
];

// 1. POST /api/reviews - Criar
router.post('/', requireAuth, validateReview, async (req, res) => {
    
    const { livro_id, rating, comment } = req.body;
    const user_id = req.session.userId; 

    const sql = 'INSERT INTO reviews (user_id, livro_id, rating, comment) VALUES (?, ?, ?, ?)';
    
    try {
        const result = await run(sql, [user_id, livro_id, rating, comment]); 
        res.status(201).json({ id: result.lastInsertRowid, user_id, livro_id, rating, comment });
        
    } catch (err) {
        console.error("Erro ao cadastrar o review:", err.message);
        
        if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ message: 'Você já avaliou este livro.' });
        }
        return res.status(500).json({ message: 'Erro interno ao cadastrar o review.' });
    }
});

// 2. GET /api/reviews/:livroId - Listar reviews
router.get('/:livroId', async (req, res) => {
    const livroId = req.params.livroId;

    const sql = `
        SELECT 
            r.id, 
            r.rating, 
            r.comment, 
            r.created_at, 
            u.username 
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.livro_id = ?
        ORDER BY r.created_at DESC
    `;
    
    try {
        const rows = await all(sql, [livroId]); 
        res.json(rows);

    } catch (err) {
        console.error("Erro ao buscar reviews:", err.message); 
        return res.status(500).json({ message: 'Erro ao buscar reviews.' });
    }
});

module.exports = router;