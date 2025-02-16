import { fazerLogin } from './utils/auth.js';
import { salvarToken } from './utils/storage.js';

document.getElementById('form-login').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const credenciais = { email, senha };

    try {
        const response = await fazerLogin(credenciais);

        if (response.ok) {
            const data = await response.json();
            salvarToken(data.token); // Salva o token no localStorage
            window.location.href = 'index.html'; // Redireciona para a página principal
        } else {
            const erro = await response.text();
            alert(`Erro ao fazer login: ${erro}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar ao servidor. Tente novamente mais tarde.');
    }
});