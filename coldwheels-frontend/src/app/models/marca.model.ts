export interface Marca {
  id: number;
  nome: string;
  paisOrigem: string;
  bandeiraPais?: string;
  logoUrl?: string;
  totalProdutos?: number;
  status: 'ATIVA' | 'INATIVA';
}

export interface ResumoMarcas {
  totalMarcas: number;
  totalPaises: number;
}
