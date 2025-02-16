import { cadastrarUsuario } from './utils/auth.js';
import { validarEmail, validarSenha } from './utils/validators.js';

document.getElementById('form-cadastro').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Validações
    if (!validarEmail(email)) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }
    if (!validarSenha(senha)) {
        alert('A senha deve ter pelo menos 6 caracteres.');
        return;
    }

    const usuario = { nome, email, senha };

    try {
        const response = await cadastrarUsuario(usuario);

        if (response.ok) {
            alert('Cadastro realizado com sucesso!');
            window.location.href = 'login.html'; // Redireciona para a tela de login
        } else {
            const erro = await response.text();
            alert(`Erro ao cadastrar: ${erro}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar ao servidor. Tente novamente.');
    }
});