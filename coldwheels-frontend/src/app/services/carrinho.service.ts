import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Carrinho } from "../models/carrinho.model";

@Injectable({
    providedIn: 'root'
})

export class CarrinhoService {
    private readonly apiUrl: string = 'http://localhost:8080/carrinhos';

    constructor(private http: HttpClient) { }

    findAll(): Observable<Carrinho[]> {
        return this.http.get<Carrinho[]>(this.apiUrl);
    }
    findById(id: any): Observable<Carrinho> {
        return this.http.get<Carrinho>(`${this.apiUrl}/${id}`);
    }
    create(carrinho: Carrinho): Observable<Carrinho> {
        return this.http.post<Carrinho>(this.apiUrl, carrinho);
    }
    update(id: number, carrinho: Carrinho): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, carrinho);
    }
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}