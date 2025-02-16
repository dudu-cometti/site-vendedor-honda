const API_BASE_URL = "http://localhost:3000/api"; // URL do backend

// Função para cadastrar um usuário
export const cadastrarUsuario = async (usuario) => {
    try {
        const response = await fetch(`${API_BASE_URL}/cadastro`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario),
        });
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        return response;
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        throw error;
    }
};

// Função para fazer login
export const fazerLogin = async (credenciais) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credenciais),
        });
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        return response;
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        throw error;
    }
};