import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { auth } from './utils/firebase-config.js';

document.getElementById('form-login').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        localStorage.setItem('userToken', user.accessToken); // Salva o token no localStorage
        alert('Login realizado com sucesso!');
        window.location.href = 'perfil.html'; // Redireciona para a tela de perfil

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login: ' + error.message);
    }
});
