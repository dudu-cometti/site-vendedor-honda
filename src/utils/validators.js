// Valida se um e-mail é válido
export const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Valida se a senha tem pelo menos 6 caracteres
export const validarSenha = (senha) => {
    return senha.length >= 6;
};