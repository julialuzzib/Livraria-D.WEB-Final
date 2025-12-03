// src/routes/index.js
const express = require("express");
const router = express.Router();

// Rotas de livros
const livrosRoutes = require("./livros.routes");
// Rotas de autenticação
const authRoutes = require("./auth.routes");
// Reviews 
const reviewsRoutes = require("./reviews"); 
// Rotas de favoritos
const favoritosRoutes = require('./favoritos');

// Rota inicial
router.get("/", (req, res) => {
    res.status(200).json({
        mensagem: "Bem-vindo à API da Livraria! Use /livros para gerenciar os livros.",
    });
});


router.use("/livros", livrosRoutes);
router.use("/auth", authRoutes);
router.use("/reviews", reviewsRoutes);
router.use('/favoritos', favoritosRoutes);

module.exports = router;