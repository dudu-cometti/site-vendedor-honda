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
  const senhaHash = await bcrypt.hash(senha, 10);
  usuarios.push({ nome, email, senha: senhaHash });
  res.status(201).send('Usuário cadastrado com sucesso!');
});

// Rota de login
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  const usuario = usuarios.find(u => u.email === email);

  if (usuario && await bcrypt.compare(senha, usuario.senha)) {
    const token = jwt.sign({ email: usuario.email }, 'seuSegredoJWT', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).send('Credenciais inválidas');
  }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));