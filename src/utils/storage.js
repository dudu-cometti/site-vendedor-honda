const TOKEN_KEY = 'token';

// Salva o token no localStorage
export const salvarToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

// Obtém o token do localStorage
export const obterToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

// Remove o token do localStorage (logout)
export const removerToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

// Verifica se o usuário está autenticado
export const estaAutenticado = () => {
    const token = obterToken();
    return !!token; // Retorna true se o token existir
};