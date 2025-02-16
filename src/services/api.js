const API_BASE_URL = "https://www.consorcionacionalhonda.com.br/api";

export const fetchVeiculos = async (estado, categoria) => {
  try {
    const response = await fetch(`${API_BASE_URL}/veiculos/categorias/list/${estado}/${categoria}`);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    throw error;
  }
};

export const fetchPlanos = async (estado, modelo) => {
  try {
    const response = await fetch(`${API_BASE_URL}/veiculo/plans/${estado}/${modelo}`);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar planos:", error);
    throw error;
  }
};