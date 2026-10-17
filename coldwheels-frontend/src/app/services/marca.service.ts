import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Marca {
  id: number;
  nome: string;
  paisOrigem: string;
  bandeiraPais?: string;
  logoUrl?: string;
  totalProdutos: number;
  status: 'ATIVA' | 'INATIVA';
}

export interface ResumoMarcas {
  totalMarcas: number;
  totalPaises: number;
}

@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  private readonly apiUrl = 'http://localhost:8080/marcas';

  constructor(private readonly http: HttpClient) {}

  getResumo(): Observable<ResumoMarcas> {
    return this.http.get<ResumoMarcas>(`${this.apiUrl}/resumo`);
  }

  getMarcas(): Observable<Marca[]> {
    return this.http.get<Marca[]>(this.apiUrl);
  }

  criarMarca(novaMarca: Omit<Marca, 'id' | 'totalProdutos' | 'status'>): Observable<Marca> {
    const payload = { ...novaMarca, status: 'ATIVA' };
    return this.http.post<Marca>(this.apiUrl, payload);
  }

  atualizarMarca(marcaAtualizada: Marca): Observable<Marca> {
    return this.http.put<Marca>(`${this.apiUrl}/${marcaAtualizada.id}`, marcaAtualizada);
  }

  excluirMarca(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
