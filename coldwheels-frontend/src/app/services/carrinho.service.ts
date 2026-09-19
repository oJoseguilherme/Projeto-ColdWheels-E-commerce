import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Carrinho } from "../models/carrinho.model";
import { PageResponse } from "../models/page-response.model";

@Injectable({
    providedIn: 'root'
})
export class CarrinhoService {
    private readonly apiUrl: string = 'http://localhost:8080/carrinhos';

    constructor(private http: HttpClient) { }

    findAll(page: number = 0, pageSize: number = 8, nome?: string, idCategoria?: number): Observable<PageResponse<Carrinho>> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());

        if (nome && nome.trim()) {
            params = params.set('nome', nome.trim());
        }

        if (idCategoria !== undefined && idCategoria !== null) {
            params = params.set('idCategoria', idCategoria.toString());
        }

        return this.http.get<PageResponse<Carrinho>>(this.apiUrl, { params });
    }

    findAllSemPaginacao(): Observable<Carrinho[]> {
        return this.http.get<Carrinho[]>(`${this.apiUrl}/todos`);
    }

    findById(id: any): Observable<Carrinho> {
        return this.http.get<Carrinho>(`${this.apiUrl}/${id}`);
    }

    create(carrinho: any): Observable<Carrinho> {
        return this.http.post<Carrinho>(this.apiUrl, carrinho);
    }

    update(id: number, carrinho: any): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, carrinho);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}