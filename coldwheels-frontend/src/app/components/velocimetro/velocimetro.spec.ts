import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VelocimetroComponent } from './velocimetro';

describe('VelocimetroComponent', () => {
  let component: VelocimetroComponent;
  let fixture: ComponentFixture<VelocimetroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VelocimetroComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(VelocimetroComponent);
    component = fixture.componentInstance;
    component.titulo = 'Vendas Totais';
    component.valor = 38450.90;
    component.tipo = 'moeda';
    fixture.detectChanges();
  });

  it('deve ser instanciado corretamente', () => {
    expect(component).toBeTruthy();
  });

  it('deve calcular escala máxima proporcional e dinâmica para valores monetários', () => {
    component.valor = 38450.90;
    component.tipo = 'moeda';
    (component as any).atualizarEscala();
    expect(component.escalaMaxima).toBeGreaterThan(38450.90);
    expect(component.escalaMaximaFormatada).toBeDefined();
  });

  it('deve calcular escala máxima proporcional e dinâmica para contagens inteiras', () => {
    component.valor = 124;
    component.tipo = 'numero';
    (component as any).atualizarEscala();
    expect(component.escalaMaxima).toBeGreaterThan(124);
  });

  it('deve tratar valor zero com escala padrão coerente', () => {
    component.valor = 0;
    component.tipo = 'numero';
    (component as any).atualizarEscala();
    expect(component.escalaMaxima).toBe(100);
  });

  it('deve utilizar duracaoAnimacaoMs de 1500ms para movimento fluido e imersivo', () => {
    expect((component as any).duracaoAnimacaoMs).toBe(1500);
  });

  it('deve reagir a mudanças de valor através de ngOnChanges', () => {
    const spyIniciar = vi.spyOn(component as any, 'iniciarAnimacao');
    component.ngOnChanges({
      valor: {
        currentValue: 500,
        previousValue: 38450.90,
        firstChange: false,
        isFirstChange: () => false
      }
    });
    expect(spyIniciar).toHaveBeenCalledWith(component.valorExibido, 500);
  });
});
