import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { CarrinhoList } from './carrinho-list';

describe('CarrinhoList', () => {
  let component: CarrinhoList;
  let fixture: ComponentFixture<CarrinhoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrinhoList],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(CarrinhoList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir todos os produtos em ordem A-Z quando filtroComposto for ord_nome_asc', () => {
    component.carrinhos = [
      { id: 1, nome: 'Zonda R', preco: 100, estoque: 5 } as any,
      { id: 2, nome: 'Alpha Romeo', preco: 50, estoque: 2 } as any,
      { id: 3, nome: 'Mustang GT', preco: 70, estoque: 10 } as any,
    ];

    component.filtroComposto = 'ord_nome_asc';

    expect(component.filtroComposto).toBe('ord_nome_asc');
    expect(component.carrinhosPaginados.length).toBe(3);
    expect(component.carrinhosPaginados[0].nome).toBe('Alpha Romeo');
    expect(component.carrinhosPaginados[1].nome).toBe('Mustang GT');
    expect(component.carrinhosPaginados[2].nome).toBe('Zonda R');
  });

  it('deve exibir todos os produtos em ordem Z-A quando filtroComposto for ord_nome_desc', () => {
    component.carrinhos = [
      { id: 1, nome: 'Alpha Romeo', preco: 50, estoque: 2 } as any,
      { id: 2, nome: 'Zonda R', preco: 100, estoque: 5 } as any,
      { id: 3, nome: 'Mustang GT', preco: 70, estoque: 10 } as any,
    ];

    component.filtroComposto = 'ord_nome_desc';

    expect(component.filtroComposto).toBe('ord_nome_desc');
    expect(component.carrinhosPaginados.length).toBe(3);
    expect(component.carrinhosPaginados[0].nome).toBe('Zonda R');
    expect(component.carrinhosPaginados[1].nome).toBe('Mustang GT');
    expect(component.carrinhosPaginados[2].nome).toBe('Alpha Romeo');
  });

  it('deve filtrar por categoria e não reter categoria ao alternar para ordenação A-Z', () => {
    component.carrinhos = [
      { id: 1, nome: 'Alpha Romeo', preco: 50, estoque: 2, categoria: { id: 1, nome: 'Super' } } as any,
      { id: 2, nome: 'Zonda R', preco: 100, estoque: 5, categoria: { id: 2, nome: 'Muscle' } } as any,
      { id: 3, nome: 'Mustang GT', preco: 70, estoque: 10, categoria: { id: 1, nome: 'Super' } } as any,
    ];

    // 1. Filtra por Categoria 1
    component.filtroComposto = 'cat_1';
    expect(component.carrinhosPaginados.length).toBe(2);
    expect(component.carrinhosPaginados.map(c => c.nome)).toEqual(['Alpha Romeo', 'Mustang GT']);

    // 2. Alterna para Z-A
    component.filtroComposto = 'ord_nome_desc';
    expect(component.carrinhosPaginados.length).toBe(3);
    expect(component.carrinhosPaginados.map(c => c.nome)).toEqual(['Zonda R', 'Mustang GT', 'Alpha Romeo']);
  });
});
