import { Routes } from '@angular/router';

import { CarrinhoList } from './components/carrinhos/carrinho-list/carrinho-list';
import { CarrinhoForm } from './components/carrinhos/carrinho-form/carrinho-form';
import { carrinhoResolver } from './resolvers/carrinho-resolver';

import { PistaList } from './components/pistas/pista-list/pista-list';
import { PistaForm } from './components/pistas/pista-form/pista-form';
import { pistaResolver } from './resolvers/pista-resolver';

import { Home } from './components/home/home';

export const routes: Routes = [

  { path: '', component: Home, title: 'ColdWheels Admin' },

  { path: 'carrinhos', component: CarrinhoList, title: 'ColdWheels - Catálogo' },
  { path: 'carrinhos/new', component: CarrinhoForm, title: 'Novo Carrinho - ColdWheels' },
  {
    path: 'carrinhos/edit/:id',
    component: CarrinhoForm,
    title: 'Editar Carrinho - ColdWheels',
    resolve: { carrinho: carrinhoResolver }
  },

  { path: 'pistas', component: PistaList, title: 'Pistas - ColdWheels' },
  { path: 'pistas/new', component: PistaForm, title: 'Nova Pista - ColdWheels' },
  {
    path: 'pistas/edit/:id',
    component: PistaForm,
    title: 'Editar Pista - ColdWheels',
    resolve: { pista: pistaResolver }
  }

];