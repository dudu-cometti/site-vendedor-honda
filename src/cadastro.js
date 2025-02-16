document.getElementById('form-cadastro').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
  
    const usuario = { nome, email, senha };
  
    try {
      const response = await fetch('/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
      });
  
      if (response.ok) {
        alert('Cadastro realizado com sucesso!');
        window.location.href = 'login.html';
      } else {
        alert('Erro ao cadastrar. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao conectar ao servidor.');
    }
  });