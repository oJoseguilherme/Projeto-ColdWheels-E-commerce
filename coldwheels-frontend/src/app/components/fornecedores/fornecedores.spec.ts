import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { FornecedoresComponent } from './fornecedores';
import { FornecedorService } from '../../services/fornecedor.service';

describe('FornecedoresComponent', () => {
  let component: FornecedoresComponent;
  let fixture: ComponentFixture<FornecedoresComponent>;

  const mockFornecedorService = {
    getResumo: () => of({ totalFornecedores: 4, totalAtivos: 3, mediaPrazoEntregaDias: 7 }),
    getFornecedores: () => of([
      { id: 1, nome: 'Apex Track Systems', status: 'ATIVO' as const, marcasIds: [1] }
    ]),
    criarFornecedor: () => of({}),
    atualizarFornecedor: () => of({}),
    excluirFornecedor: () => of(true)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FornecedoresComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: FornecedorService, useValue: mockFornecedorService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FornecedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar fornecedores e resumo', () => {
    expect(component.fornecedores.length).toBeGreaterThan(0);
    expect(component.resumo.totalFornecedores).toBeGreaterThan(0);
    expect(component.resumo.totalAtivos).toBeGreaterThan(0);
  });
});

