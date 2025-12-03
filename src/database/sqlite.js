// src/database/sqlite.js
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DB_FILE = process.env.SQLITE_DB_FILE || path.join(__dirname, '../data/livraria.db');
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

// Singleton
let db;
function getDb() {
    if (!db) {
        db = new Database(DB_FILE);
        db.pragma('foreign_keys = ON');
    }
    return db;
}

function run(sql, params = []) {
    return getDb().prepare(sql).run(...params);
}

function get(sql, params = []) {
    return getDb().prepare(sql).get(...params);
}

function all(sql, params = []) {
    return getDb().prepare(sql).all(...params);
}

function query(sql, params = []) {
    const rows = getDb().prepare(sql).all(...params);
    if (rows.length === 0) return null;
    if (rows.length === 1) return rows[0];
    return rows;
}

function init() {
    run(`
        CREATE TABLE IF NOT EXISTS livros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            autor TEXT NOT NULL,
            categoria TEXT NOT NULL,
            ano INTEGER NOT NULL
        )
    `);
    run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    run(`
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            livro_id INTEGER NOT NULL,
            rating INTEGER NOT NULL CHECK(rating >= 0 AND rating <= 5), -- Avaliação de 0 a 5
            comment TEXT, -- O parágrafo de opinião/resumo
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            
            -- Garantindo que cada usuário só possa fazer uma avaliação por livro
            UNIQUE(user_id, livro_id), 
            
            -- Relacionamentos (Foreign Keys)
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE CASCADE
        )
    `);

    run(`
        CREATE TABLE IF NOT EXISTS favorites (
            user_id INTEGER NOT NULL,
            livro_id INTEGER NOT NULL,
            -- Garante que um usuário só pode favoritar um livro uma vez
            UNIQUE(user_id, livro_id),
            -- Define chaves estrangeiras
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE CASCADE
        );
    `);
    
    console.log('Banco de dados SQLite inicializado (livros, users, reviews)');
}

module.exports = { getDb, run, get, all, query, init };