import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Marcas } from './marcas';
import { MarcaService } from '../../services/marca.service';

describe('Marcas', () => {
  let component: Marcas;
  let fixture: ComponentFixture<Marcas>;

  const mockMarcaService = {
    getResumo: () => of({ totalMarcas: 6, totalPaises: 5 }),
    getMarcas: () => of([
      { id: 1, nome: 'Hot Wheels (Mattel)', paisOrigem: 'Estados Unidos', totalProdutos: 48, status: 'ATIVA' as const }
    ]),
    criarMarca: () => of({}),
    atualizarMarca: () => of({}),
    excluirMarca: () => of(true)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Marcas],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: MarcaService, useValue: mockMarcaService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Marcas);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar marcas e resumo', () => {
    expect(component.marcas.length).toBeGreaterThan(0);
    expect(component.resumo.totalMarcas).toBeGreaterThan(0);
    expect(component.resumo.totalPaises).toBeGreaterThan(0);
  });
});

