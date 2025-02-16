document.getElementById('form-login').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
  
    const credenciais = { email, senha };
  
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credenciais),
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Salva o token no localStorage
        window.location.href = 'index.html'; // Redireciona para a página principal
      } else {
        alert('E-mail ou senha incorretos.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao conectar ao servidor.');
    }
  });