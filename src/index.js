import { fetchVeiculos, fetchPlanos } from './services/api';
import { formatVeiculos } from './utils/formatData';

const loadVeiculos = async () => {
  const estado = "ES"; // Estado do Espírito Santo
  const categoria = "motos"; // Categoria de motos

  try {
    const data = await fetchVeiculos(estado, categoria);
    const formattedVeiculos = formatVeiculos(data);
    renderVeiculos(formattedVeiculos, estado);
  } catch (error) {
    console.error("Erro ao carregar veículos:", error);
    renderError("Erro ao carregar veículos. Verifique o console para mais detalhes.");
  }
};

const renderVeiculos = (veiculos, estado) => {
  const veiculosList = document.getElementById("veiculos-list");
  veiculosList.innerHTML = veiculos
    .map(
      (veiculo) => `
      <li class="veiculo-item">
        <img src="${veiculo.foto}" alt="${veiculo.nome}" class="veiculo-foto">
        <div class="veiculo-info">
          <h3>${veiculo.nome}</h3>
          <p><strong>Modelo:</strong> ${veiculo.modelo}</p>
          <p><strong>Categoria:</strong> ${veiculo.categoria}</p>
          <p><strong>Valor do Crédito:</strong> R$ ${veiculo.valorCredito}</p>
          <button class="simular-btn" data-estado="${estado}" data-modelo="${veiculo.slug}" data-foto="${veiculo.foto}" data-nome="${veiculo.nome}">Simular</button>
        </div>
      </li>
    `
    )
    .join("");

  // Adiciona os listeners para os botões de simulação
  document.querySelectorAll(".simular-btn").forEach((botao) => {
    botao.addEventListener("click", async (event) => {
      const estado = event.target.getAttribute("data-estado");
      const modelo = event.target.getAttribute("data-modelo");
      const foto = event.target.getAttribute("data-foto");
      const nome = event.target.getAttribute("data-nome");

      // Exibe o modal
      const modal = document.getElementById("modal-simulacao");
      const detalhesSimulacao = document.getElementById("detalhes-simulacao");

      // Exibe a foto e o nome da moto com um ícone de carregamento
      detalhesSimulacao.innerHTML = `
        <div class="veiculo-simulacao">
          <img src="${foto}" alt="${nome}" class="veiculo-foto">
          <h3>${nome}</h3>
        </div>
        <div id="planos-simulacao">
          <div class="loading">Carregando planos... <span class="spinner"></span></div>
        </div>
      `;

      modal.style.display = "flex";

      // Busca os planos de parcelamento
      try {
        const planos = await fetchPlanos(estado, modelo);
        const planosSimulacao = document.getElementById("planos-simulacao");
        planosSimulacao.innerHTML = renderPlanos(planos);
      } catch (error) {
        console.error("Erro ao carregar planos:", error);
        detalhesSimulacao.innerHTML += "<p class='error'>Erro ao carregar planos. Tente novamente mais tarde.</p>";
      }
    });
  });

  // Fecha o modal ao clicar no botão de fechar
  const closeBtn = document.querySelector(".close-btn");
  closeBtn.addEventListener("click", () => {
    const modal = document.getElementById("modal-simulacao");
    modal.style.display = "none";
  });

  // Fecha o modal ao clicar no botão "Voltar"
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("voltar-btn")) {
      const modal = document.getElementById("modal-simulacao");
      modal.style.display = "none";
    }
  });

  // Fecha o modal ao clicar fora dele
  window.addEventListener("click", (event) => {
    const modal = document.getElementById("modal-simulacao");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};

//mudanca
const renderPlanos = (plano) => {
  if (!plano.plans || !Array.isArray(plano.plans)) {
    return "<p>Nenhum plano disponível.</p>";
  }

  // Verifica se há apenas um plano
  const isUnicoPlano = plano.plans.length === 1;

  return `
    <h4>Planos Disponíveis:</h4>
    <div class="planos-container">
      ${plano.plans
        .map(
          (plano) => `
        <div class="plano-item ${isUnicoPlano ? 'centralizado' : ''}">
          <h5>${plano.name}</h5>
          <div class="opcoes">
            ${plano.options.withInsurance
              .map(
                (opcao) => `
              <label class="opcao-parcela">
                <input type="radio" name="parcela" value="${opcao.value}" data-plano="${plano.name}">
                <span>${opcao.numberInstallments}x de R$ ${opcao.value}</span>
              </label>
            `
              )
              .join("")}
          </div>
        </div>
      `
        )
        .join("")}
      <div class="botoes-modal">
        <button class="voltar-btn">Voltar</button>
        <button id="whatsapp-btn" class="whatsapp-btn">Solicitar via WhatsApp</button>
      </div>
    </div>
  `;
};

// Função para enviar mensagem no WhatsApp com modal para nome e telefone
const enviarWhatsApp = (nome, modelo, plano, parcela, clienteNome, clienteTelefone) => {
  const mensagem = `Olá, meu nome é ${clienteNome}, meu telefone é ${clienteTelefone}. Gostaria de simular o consórcio da moto ${nome}. Plano: ${plano}, Parcela: ${parcela}.`;
  const urlWhatsApp = `https://wa.me/5527996474724?text=${encodeURIComponent(mensagem)}`;
  window.open(urlWhatsApp, "_blank");
};

// Cria o modal para capturar nome e telefone
const criarModal = () => {
  const modal = document.createElement("div");
  modal.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-content-captura">
        <h3>Insira seus dados</h3>
        <input type="text" id="cliente-nome" placeholder="Seu nome" required />
        <input type="tel" id="cliente-telefone" placeholder="Seu telefone" required />
        <button id="confirmar-dados">Confirmar</button>
        <button id="fechar-modal">Fechar</button>
      </div>
    </div>`;
  document.body.appendChild(modal);

  document.getElementById("fechar-modal").addEventListener("click", () => modal.remove());
  document.getElementById("confirmar-dados").addEventListener("click", () => {
    const clienteNome = document.getElementById("cliente-nome").value;
    const clienteTelefone = document.getElementById("cliente-telefone").value;

    if (clienteNome && clienteTelefone) {
      const parcelaSelecionada = document.querySelector("input[name='parcela']:checked");
      const nome = document.querySelector(".veiculo-simulacao h3").innerText;
      const modelo = document.querySelector(".simular-btn").getAttribute("data-modelo");
      const plano = parcelaSelecionada.getAttribute("data-plano");
      const valor = parcelaSelecionada.value;
      enviarWhatsApp(nome, modelo, plano, valor, clienteNome, clienteTelefone);
      modal.remove();
    } else {
      alert("Preencha todos os campos.");
    }
  });
};

// Listener para o botão do WhatsApp
document.addEventListener("click", (event) => {
  if (event.target.id === "whatsapp-btn") {
    const parcelaSelecionada = document.querySelector("input[name='parcela']:checked");
    if (parcelaSelecionada) {
      criarModal();
    } else {
      alert("Selecione uma parcela antes de continuar.");
    }
  }
});

// Dados do usuário (exemplo)
const usuario = {
  fotoPerfil: 'url-da-foto.jpg', // URL da foto do perfil
  nome: 'João Silva', // Nome do usuário
  redesSociais: {
    instagram: 'https://instagram.com/joaosilva', // Link do Instagram
    whatsapp: 'https://wa.me/5511999999999' // Link do WhatsApp
  }
};

// Função para atualizar o perfil
function atualizarPerfil(usuario) {
  if (!usuario) {
    console.error('Dados do usuário inválidos ou nulos');
    return;
  }

  // Atualiza a foto do perfil
  const fotoPerfil = document.getElementById('foto-perfil');
  if (usuario.fotoPerfil) {
    fotoPerfil.src = usuario.fotoPerfil;
  } else {
    fotoPerfil.src = 'foto-padrao.jpg'; // Foto padrão caso não haja foto
  }

  // Atualiza o nome do usuário
  const nomeUsuario = document.getElementById('nome-usuario');
  if (usuario.nome) {
    nomeUsuario.textContent = usuario.nome;
  } else {
    nomeUsuario.textContent = 'Nome do Usuário'; // Nome padrão caso não haja nome
  }

  // Atualiza as redes sociais
  const instagram = document.getElementById('instagram');
  const whatsapp = document.getElementById('whatsapp');
  if (usuario.redesSociais) {
    if (usuario.redesSociais.instagram) {
      instagram.href = usuario.redesSociais.instagram;
    } else {
      instagram.style.display = 'none'; // Oculta o link se não houver Instagram
    }
    if (usuario.redesSociais.whatsapp) {
      whatsapp.href = usuario.redesSociais.whatsapp;
    } else {
      whatsapp.style.display = 'none'; // Oculta o link se não houver WhatsApp
    }
  }
}

// Chama a função para atualizar o perfil
atualizarPerfil(usuario);

const renderError = (message) => {
  const veiculosList = document.getElementById("veiculos-list");
  veiculosList.innerHTML = `<li class="error">${message}</li>`;
};

loadVeiculos();