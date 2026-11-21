import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PistaList } from './pista-list';

describe('PistaList', () => {
  let component: PistaList;
  let fixture: ComponentFixture<PistaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PistaList],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PistaList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir todas as pistas em ordem A-Z quando filtroComposto for ord_nome_asc', () => {
    component.pistas.set([
      { id: 1, nome: 'Pista Z', preco: 150, estoque: 3 } as any,
      { id: 2, nome: 'Circuito A', preco: 200, estoque: 10 } as any,
      { id: 3, nome: 'Looping M', preco: 180, estoque: 5 } as any,
    ]);

    component.filtroComposto = 'ord_nome_asc';

    expect(component.filtroComposto).toBe('ord_nome_asc');
    expect(component.pistasFiltradas().length).toBe(3);
    expect(component.pistasFiltradas()[0].nome).toBe('Circuito A');
    expect(component.pistasFiltradas()[1].nome).toBe('Looping M');
    expect(component.pistasFiltradas()[2].nome).toBe('Pista Z');
  });

  it('deve exibir todas as pistas em ordem Z-A quando filtroComposto for ord_nome_desc', () => {
    component.pistas.set([
      { id: 1, nome: 'Circuito A', preco: 200, estoque: 10 } as any,
      { id: 2, nome: 'Pista Z', preco: 150, estoque: 3 } as any,
      { id: 3, nome: 'Looping M', preco: 180, estoque: 5 } as any,
    ]);

    component.filtroComposto = 'ord_nome_desc';

    expect(component.filtroComposto).toBe('ord_nome_desc');
    expect(component.pistasFiltradas().length).toBe(3);
    expect(component.pistasFiltradas()[0].nome).toBe('Pista Z');
    expect(component.pistasFiltradas()[1].nome).toBe('Looping M');
    expect(component.pistasFiltradas()[2].nome).toBe('Circuito A');
  });
});
