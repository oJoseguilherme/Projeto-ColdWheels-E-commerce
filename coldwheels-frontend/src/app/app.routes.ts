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
import { Produtos } from './components/produtos/produtos';
import { Estoque } from './components/estoque/estoque';
import { FornecedoresComponent } from './components/fornecedores/fornecedores';
import { Marcas } from './components/marcas/marcas';
import { Pedidos } from './components/pedidos/pedidos';
import { AdminForm } from './components/administradores/admin-form/admin-form';

export const routes: Routes = [

  { path: '', component: Home, title: 'ColdWheels Admin' },
  { path: 'produtos', component: Produtos, title: 'Gerenciar Produtos - ColdWheels' },
  { path: 'estoque', component: Estoque, title: 'Controle de Estoque - ColdWheels' },
  { path: 'fornecedores', component: FornecedoresComponent, title: 'Fornecedores Homologados - ColdWheels' },
  { path: 'marcas', component: Marcas, title: 'Marcas Parceiras - ColdWheels' },
  { path: 'pedidos', component: Pedidos, title: 'Gerenciar Pedidos - ColdWheels' },
  { path: 'administradores/new', component: AdminForm, title: 'Novo Administrador - ColdWheels' },

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
