import { TestBed } from '@angular/core/testing';
import { PistaFotoService } from './pista-foto.service';

describe('PistaFotoService', () => {
  let service: PistaFotoService;

  const pistasCatalogo = [
    { nome: 'ColdWheels Action Pista de Brinquedo Pista de Acrobacias Lança e Bate', slugEsperado: 'lanca-e-bate' },
    { nome: 'ColdWheels Action Pista de Brinquedo Super Lançamento', slugEsperado: 'super-lancamento' },
    { nome: 'ColdWheels Action Pista de Brinquedo Campeonato de Loop', slugEsperado: 'campeonato-loop' },
    { nome: 'ColdWheels Racing Pista de Brinquedo Sprint', slugEsperado: 'sprint' },
    { nome: 'ColdWheels STEAM Balance Shift Playset (Desafio do Equilíbrio)', slugEsperado: 'desafio-equilibrio' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PistaFotoService);
  });

  it('deve ser instanciado com sucesso', () => {
    expect(service).toBeTruthy();
  });

  it('deve mapear todas as 5 pistas oficiais para suas imagens correspondentes', () => {
    for (const pista of pistasCatalogo) {
      const par = service.getFotoPar({ nome: pista.nome });
      expect(par).not.toBeNull();
      if (par) {
        expect(par.slug).toBe(pista.slugEsperado);
        expect(service.getFotoPrincipal({ nome: pista.nome })).toBe(par.principal);
      }
    }
  });

  it('deve recuperar foto por fallback de ID', () => {
    const par = service.getFotoPar({ id: 9, nome: 'Pista com Nome Modificado' });
    expect(par).not.toBeNull();
    expect(par?.slug).toBe('lanca-e-bate');
  });

  it('deve retornar null para itens desconhecidos sem imagem', () => {
    expect(service.getFotoPar(null)).toBeNull();
    expect(service.getFotoPar({ nome: 'Pista Desconhecida XYZ' })).toBeNull();
  });
});
