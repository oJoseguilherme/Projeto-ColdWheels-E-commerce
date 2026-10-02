import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ViaCepResponse } from '../models/via-cep.model';

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {

  private readonly apiUrl = 'https://viacep.com.br/ws';

  constructor(private readonly http: HttpClient) {}

  consultar(cep: string): Observable<ViaCepResponse> {
    return this.http.get<ViaCepResponse>(
      `${this.apiUrl}/${cep}/json/`
    );
  }
}
