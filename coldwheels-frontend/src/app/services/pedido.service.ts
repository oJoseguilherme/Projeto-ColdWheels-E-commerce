import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export type StatusPedido = 'PENDENTE' | 'PAGO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO';

export interface Pedido {
  id: number;
  numeroPedido: string;
  nomeCliente: string;
  emailCliente: string;
  dataCompra: string;
  itensTotais: number;
  quantiaTotal: number;
  status: StatusPedido;
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private readonly apiUrl = 'http://localhost:8080/pedidos';

  constructor(private readonly http: HttpClient) {}

  getPedidos(termo?: string, status?: string): Observable<Pedido[]> {
    let params = new HttpParams();
    if (termo && termo.trim()) {
      params = params.set('termo', termo.trim());
    }
    if (status && status.trim()) {
      params = params.set('status', status.trim());
    }

    return this.http.get<Pedido[]>(this.apiUrl, { params });
  }

  atualizarStatus(id: number, novoStatus: StatusPedido): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.apiUrl}/${id}/status`, { status: novoStatus });
  }
}
