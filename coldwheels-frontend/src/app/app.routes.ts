import { Routes } from '@angular/router';

import { CarrinhoList } from './components/carrinhos/carrinho-list/carrinho-list';
import { CarrinhoForm } from './components/carrinhos/carrinho-form/carrinho-form';
import { carrinhoResolver } from './resolvers/carrinho-resolver';

import { PistaList } from './components/pistas/pista-list/pista-list';
import { PistaForm } from './components/pistas/pista-form/pista-form';
import { pistaResolver } from './resolvers/pista-resolver';

import { ClienteList } from './components/clientes/cliente-list/cliente-list';
import { ClienteForm } from './components/clientes/cliente-form/cliente-form';
import { clienteResolver } from './resolvers/cliente-resolver';

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
  },

  { path: 'clientes', component: ClienteList, title: 'Clientes - ColdWheels' },
  { path: 'clientes/new', component: ClienteForm, title: 'Novo Cliente - ColdWheels' },
  {
    path: 'clientes/edit/:id',
    component: ClienteForm,
    title: 'Editar Cliente - ColdWheels',
    resolve: { cliente: clienteResolver }
  }

];
