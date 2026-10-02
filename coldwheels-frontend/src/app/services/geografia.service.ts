import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Estado, Municipio } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class GeografiaService {

  private readonly apiUrl = 'http://localhost:8080/geografia';

  constructor(private readonly http: HttpClient) {}

  findEstados(): Observable<Estado[]> {
    return this.http.get<Estado[]>(`${this.apiUrl}/estados`);
  }

  findMunicipiosByUf(uf: string): Observable<Municipio[]> {
    const params = new HttpParams().set('uf', uf);

    return this.http.get<Municipio[]>(
      `${this.apiUrl}/municipios`,
      { params }
    );
  }

  findMunicipioByCodigoIbge(codigoIbge: string): Observable<Municipio> {
    return this.http.get<Municipio>(
      `${this.apiUrl}/municipios/ibge/${codigoIbge}`
    );
  }
}
