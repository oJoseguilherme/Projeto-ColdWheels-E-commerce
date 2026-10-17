import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardMetricas {
  vendasTotais: number;
  totalUsuarios: number;
  totalPedidos: number;
  estoqueBaixoCount: number;
}

export interface ItemEstoqueBaixo {
  id: number;
  nome: string;
  tipo: 'CARRINHO' | 'PISTA';
  estoqueAtual: number;
  estoqueMinimo: number;
  preco: number;
}

export interface PedidoRecente {
  id: number;
  numero: string;
  clienteNome: string;
  dataCompra: string;
  totalItens: number;
  valorTotal: number;
  status: 'PAGO' | 'PENDENTE' | 'ENVIADO' | 'CANCELADO';
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly apiUrl = 'http://localhost:8080/dashboard';

  constructor(private readonly http: HttpClient) {}

  getMetricas(): Observable<DashboardMetricas> {
    return this.http.get<DashboardMetricas>(`${this.apiUrl}/metricas`);
  }

  getProdutosEstoqueBaixo(): Observable<ItemEstoqueBaixo[]> {
    return this.http.get<ItemEstoqueBaixo[]>(`${this.apiUrl}/estoque-baixo`);
  }

  getPedidosRecentes(): Observable<PedidoRecente[]> {
    return this.http.get<PedidoRecente[]>(`${this.apiUrl}/pedidos-recentes`);
  }
}
