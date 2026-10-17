import { TestBed } from '@angular/core/testing';
import { CarrinhoFotoService } from './carrinho-foto.service';

describe('CarrinhoFotoService', () => {
  let service: CarrinhoFotoService;

  const carrosCatalogo = [
    { nome: 'ColdWheels Premium Car Culture Ferrari Testarossa', slugEsperado: 'ferrari-testarossa' },
    { nome: 'ColdWheels Premium Car Culture EuroSpeed Automobili Pininfarina Battista', slugEsperado: 'pininfarina-battista' },
    { nome: 'ColdWheels RLC Exclusive RWB Porsche 930', slugEsperado: 'porsche-930' },
    { nome: 'ColdWheels Premium Car Culture \'84 Mustang SVO', slugEsperado: 'mustang-svo' },
    { nome: 'ColdWheels Premium Car Culture BMW M3', slugEsperado: 'bmw-m3' },
    { nome: 'ColdWheels Premium Car Culture Lancia Stratos', slugEsperado: 'lancia-stratos' },
    { nome: 'ColdWheels RLC Exclusive 1965 Shelby Cobra 427 S/C', slugEsperado: 'shelby-cobra' },
    { nome: 'ColdWheels Boulevard Meyers Manx', slugEsperado: 'meyers-manx' },
    { nome: 'ColdWheels Car Culture Toyota Land Cruiser', slugEsperado: 'toyota-land-cruiser' },
    { nome: 'ColdWheels Premium Car Culture 2024 Mustang RTR Spec 5-FD', slugEsperado: 'mustang-rtr' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarrinhoFotoService);
  });

  it('deve ser instanciado com sucesso', () => {
    expect(service).toBeTruthy();
  });

  it('deve mapear todos os 10 carros oficiais com fotos de frente e traseira', () => {
    for (const carro of carrosCatalogo) {
      const par = service.getFotoPar({ nome: carro.nome });
      expect(par).not.toBeNull();
      if (par) {
        expect(par.slug).toBe(carro.slugEsperado);
        expect(par.frente).toBe(`assets/images/carrinhos/${carro.slugEsperado}/frente.jpeg`);
        expect(par.traseira).toBe(`assets/images/carrinhos/${carro.slugEsperado}/traseira.jpeg`);
        expect(service.getFotoPrincipal({ nome: carro.nome })).toBe(par.frente);
        expect(service.getFotoSecundaria({ nome: carro.nome })).toBe(par.traseira);
      }
    }
  });

  it('deve recuperar fotos por fallback de ID', () => {
    const par = service.getFotoPar({ id: 18, nome: 'Nome Alterado' });
    expect(par).not.toBeNull();
    expect(par?.slug).toBe('ferrari-testarossa');
  });

  it('deve retornar null para itens vazios ou sem imagem', () => {
    expect(service.getFotoPar(null)).toBeNull();
    expect(service.getFotoPar({ nome: 'Carro Desconhecido 12345' })).toBeNull();
  });
});
