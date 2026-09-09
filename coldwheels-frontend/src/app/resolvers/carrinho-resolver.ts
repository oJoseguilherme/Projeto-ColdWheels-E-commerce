import { ResolveFn } from "@angular/router";
import { Carrinho } from "../models/carrinho.model";
import { inject } from "@angular/core";
import { CarrinhoService } from "../services/carrinho.service";

export const carrinhoResolver: ResolveFn<Carrinho> = (route, state) => {
    return inject(CarrinhoService).findById(route.paramMap.get('id'));
}