import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fornecedor, FornecedorRequest, ResumoFornecedores } from '../models/fornecedor.model';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {

  private readonly apiUrl = 'http://localhost:8080/fornecedores';

  constructor(private readonly http: HttpClient) {}

  getFornecedores(): Observable<Fornecedor[]> {
    return this.http.get<Fornecedor[]>(this.apiUrl);
  }

  getResumo(): Observable<ResumoFornecedores> {
    return this.http.get<ResumoFornecedores>(`${this.apiUrl}/resumo`);
  }

  criarFornecedor(request: FornecedorRequest): Observable<Fornecedor> {
    return this.http.post<Fornecedor>(this.apiUrl, request);
  }

  atualizarFornecedor(id: number, request: FornecedorRequest): Observable<Fornecedor> {
    return this.http.put<Fornecedor>(`${this.apiUrl}/${id}`, request);
  }

  excluirFornecedor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
