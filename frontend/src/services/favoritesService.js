import api from './api'; 

export const favoritesService = {
    async listarFavoritos() {
        const response = await api.get('/favoritos');
        return response.data;
    },

    async adicionarFavorito(livroId) {
        // POST /api/favoritos
        const response = await api.post('/favoritos', { livro_id: livroId });
        return response.data;
    },

    async removerFavorito(livroId) {
        // DELETE /api/favoritos/:livroId
        const response = await api.delete(`/favoritos/${livroId}`);
        return response.data;
    },
};