const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const usuarios = []; // Simula um banco de dados

// Rota de cadastro
app.post('/api/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;

    // Validação dos campos
    if (!nome || !email || !senha) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    // Verifica se o e-mail já está cadastrado
    const usuarioExistente = usuarios.find(u => u.email === email);
    if (usuarioExistente) {
        return res.status(400).send('E-mail já cadastrado.');
    }

    // Cria o usuário
    const senhaHash = await bcrypt.hash(senha, 10);
    usuarios.push({ nome, email, senha: senhaHash });
    res.status(201).send('Usuário cadastrado com sucesso!');
});

// Rota de login
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;

    // Validação dos campos
    if (!email || !senha) {
        return res.status(400).send('E-mail e senha são obrigatórios.');
    }

    // Verifica se o usuário existe
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) {
        return res.status(401).send('Credenciais inválidas.');
    }

    // Verifica a senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
        return res.status(401).send('Credenciais inválidas.');
    }

    // Gera o token JWT
    const token = jwt.sign({ email: usuario.email }, 'seuSegredoJWT', { expiresIn: '1h' });
    res.json({ token });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));