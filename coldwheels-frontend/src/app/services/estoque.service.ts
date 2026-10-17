import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ResumoEstoque {
  emEstoque: number;
  estoqueBaixo: number;
  esgotado: number;
}

export interface ItemEstoque {
  id: number;
  nome: string;
  tipo: 'CARRINHO' | 'PISTA';
  codigoSku: string;
  quantidade: number;
  estoqueMinimo: number;
  status: 'EM_ESTOQUE' | 'ESTOQUE_BAIXO' | 'ESGOTADO';
  preco: number;
}

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {

  private readonly apiUrl = 'http://localhost:8080/estoque';

  constructor(private readonly http: HttpClient) {}

  getResumo(): Observable<ResumoEstoque> {
    return this.http.get<ResumoEstoque>(`${this.apiUrl}/resumo`);
  }

  getItens(termo?: string, filtroComposto?: string): Observable<ItemEstoque[]> {
    let params = new HttpParams();
    if (termo && termo.trim()) {
      params = params.set('termo', termo.trim());
    }
    if (filtroComposto && filtroComposto.trim()) {
      params = params.set('filtro', filtroComposto.trim());
    }

    return this.http.get<ItemEstoque[]>(this.apiUrl, { params });
  }

  ajustarQuantidade(id: number, delta: number, tipo?: 'CARRINHO' | 'PISTA'): Observable<ItemEstoque> {
    const tipoFinal = tipo || 'CARRINHO';
    return this.http.patch<ItemEstoque>(`${this.apiUrl}/${tipoFinal}/${id}`, { delta });
  }
}
