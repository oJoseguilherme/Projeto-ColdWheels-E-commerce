import { Routes } from '@angular/router';
import { CarrinhoList } from './components/carrinhos/carrinho-list/carrinho-list';
import { CarrinhoForm } from './components/carrinhos/carrinho-form/carrinho-form';
import { carrinhoResolver } from './resolvers/carrinho-resolver';

export const routes: Routes = [

    { path: '', redirectTo: 'carrinhos', pathMatch: 'full' },
    { path: 'carrinhos', component: CarrinhoList, title: 'ColdWheels - Catálogo' },
    { path: 'carrinhos/new', component: CarrinhoForm, title: 'Novo Carrinho - ColdWheels' },
    {
        path: 'carrinhos/edit/:id',
        component: CarrinhoForm,
        title: 'Editar Carrinho - ColdWheels',
        resolve: { carrinho: carrinhoResolver }
    },
];
