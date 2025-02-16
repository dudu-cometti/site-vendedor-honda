export const formatVeiculos = (data) => {
    if (!data.vehicles || !Array.isArray(data.vehicles)) {
      throw new Error("Formato de dados inválido.");
    }
  
    // Extrai todos os veículos de todas as categorias
    const veiculos = data.vehicles.flatMap((categoria) => categoria.vehicles);
  
    return veiculos.map((veiculo) => ({
      id: veiculo.id,
      nome: veiculo.name,
      modelo: veiculo.model,
      categoria: veiculo.category,
      valorCredito: veiculo.creditValue,
      foto: `https:${veiculo.photo}`,
      slug: veiculo.slug, // Adicionamos o slug para usar na simulação
    }));
  };