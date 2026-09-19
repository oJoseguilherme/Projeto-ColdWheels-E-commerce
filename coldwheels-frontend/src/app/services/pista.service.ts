import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Pista, PistaRequest } from '../models/pista.model';

@Injectable({
  providedIn: 'root'
})
export class PistaService {

  private readonly apiUrl = 'http://localhost:8080/pistas';

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<Pista[]> {
    return this.http.get<Pista[]>(this.apiUrl);
  }

  findById(id: number): Observable<Pista> {
    return this.http.get<Pista>(`${this.apiUrl}/${id}`);
  }

  create(pista: PistaRequest): Observable<Pista> {
    return this.http.post<Pista>(this.apiUrl, pista);
  }

  update(id: number, pista: PistaRequest): Observable<Pista> {
    return this.http.put<Pista>(`${this.apiUrl}/${id}`, pista);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}