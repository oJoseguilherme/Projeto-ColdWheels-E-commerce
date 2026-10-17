import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Estoque } from './estoque';
import { EstoqueService } from '../../services/estoque.service';

describe('Estoque', () => {
  let component: Estoque;
  let fixture: ComponentFixture<Estoque>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Estoque],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Estoque);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar itens e resumo de estoque', () => {
    expect(component.itens.length).toBeGreaterThan(0);
    expect(component.resumo).toBeDefined();
  });

  it('deve preservar lista vazia legítima sem fazer fallback para mock', () => {
    const estoqueService = TestBed.inject(EstoqueService);
    vi.spyOn(estoqueService, 'getItens').mockReturnValue(of([]));

    component.carregarItens();

    expect(component.itens).toEqual([]);
    expect(component.carregando).toBe(false);
  });

  it('deve tratar falha HTTP exibindo snackbar e encerrando carregamento', () => {
    const estoqueService = TestBed.inject(EstoqueService);
    const snackBar = (component as any).snackBar;
    const snackBarSpy = vi.spyOn(snackBar, 'open');
    vi.spyOn(estoqueService, 'getItens').mockReturnValue(throwError(() => new Error('Falha de rede na API')));

    component.carregarItens();

    expect(component.itens).toEqual([]);
    expect(component.carregando).toBe(false);
    expect(snackBarSpy).toHaveBeenCalledWith(
      expect.stringContaining('Falha na comunicação com a API'),
      'Tentar Novamente',
      expect.any(Object)
    );
  });
});
