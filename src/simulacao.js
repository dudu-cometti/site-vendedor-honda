// Função para carregar os detalhes da simulação
const loadSimulacao = () => {
    // Obtém os parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const estado = urlParams.get('estado');
    const modelo = urlParams.get('modelo');
    const foto = urlParams.get('foto');
    const nome = urlParams.get('nome');
  
    // Exibe a foto e o nome da moto
    const detalhesSimulacao = document.getElementById("detalhes-simulacao");
    detalhesSimulacao.innerHTML = `
      <div class="veiculo-simulacao">
        <img src="${foto}" alt="${nome}" class="veiculo-foto">
        <h3>${nome}</h3>
      </div>
      <div id="planos-simulacao"></div>
    `;
  
    // Busca os planos de parcelamento
    fetchPlanos(estado, modelo)
      .then((planos) => {
        const planosSimulacao = document.getElementById("planos-simulacao");
        planosSimulacao.innerHTML = renderPlanos(planos);
      })
      .catch((error) => {
        console.error("Erro ao carregar planos:", error);
        detalhesSimulacao.innerHTML += "<p>Erro ao carregar planos. Tente novamente mais tarde.</p>";
      });
  };
  
  // Função para buscar os planos de parcelamento
  const fetchPlanos = async (estado, modelo) => {
    const response = await fetch(`https://www.consorcionacionalhonda.com.br/api/veiculo/plans/${estado}/${modelo}`);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    return await response.json();
  };
  
  // Função para renderizar os planos de parcelamento
  const renderPlanos = (plano) => {
    if (!plano.plans || !Array.isArray(plano.plans)) {
      return "<p>Nenhum plano disponível.</p>";
    }
  
    return `
      <h4>Planos Disponíveis:</h4>
      <div class="planos-container">
        ${plano.plans
          .map(
            (plano) => `
          <div class="plano-item">
            <h5>${plano.name}</h5>
            <div class="opcoes">
              <h6>Com Seguro:</h6>
              <ul>
                ${plano.options.withInsurance
                  .map(
                    (opcao) => `
                  <li>
                    ${opcao.numberInstallments}x de R$ ${opcao.value}
                  </li>
                `
                  )
                  .join("")}
              </ul>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  };
  
  // Carrega a simulação ao abrir a página
  loadSimulacao();