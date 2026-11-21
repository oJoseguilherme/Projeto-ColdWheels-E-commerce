import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { FornecedorDialogComponent } from './fornecedor-dialog';
import { ViaCepService } from '../../../services/via-cep.service';

describe('FornecedorDialogComponent', () => {
  let component: FornecedorDialogComponent;
  let fixture: ComponentFixture<FornecedorDialogComponent>;

  const mockDialogRef = {
    close: vi.fn()
  };

  const mockViaCepService = {
    consultar: vi.fn()
  };

  const mockSnackBar = {
    open: vi.fn()
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [FornecedorDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: ViaCepService, useValue: mockViaCepService }
      ]
    }).overrideComponent(FornecedorDialogComponent, {
      set: {
        providers: [
          { provide: MatSnackBar, useValue: mockSnackBar }
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(FornecedorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser instanciado corretamente', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeTruthy();
    expect(component.form.get('cep')).toBeTruthy();
  });

  it('deve preencher cidade e UF ao consultar CEP com sucesso e manter os campos editáveis', () => {
    mockViaCepService.consultar.mockReturnValue(of({
      cep: '01310-100',
      logradouro: 'Avenida Paulista',
      bairro: 'Bela Vista',
      localidade: 'São Paulo',
      uf: 'SP'
    }));

    component.form.get('cep')?.setValue('01310-100');
    component.consultarCep();

    expect(mockViaCepService.consultar).toHaveBeenCalledWith('01310100');
    expect(component.form.get('cidade')?.value).toBe('São Paulo');
    expect(component.form.get('uf')?.value).toBe('SP');

    // Ressalva 1: Os campos continuam editáveis após a consulta
    expect(component.form.get('cidade')?.enabled).toBe(true);
    expect(component.form.get('uf')?.enabled).toBe(true);

    // Usuário pode livremente alterar a cidade e a UF
    component.form.get('cidade')?.setValue('São Paulo Customizado');
    expect(component.form.get('cidade')?.value).toBe('São Paulo Customizado');
  });

  it('deve manter a independência da API caso a consulta falhe (previsão de queda de API)', () => {
    mockViaCepService.consultar.mockReturnValue(throwError(() => new Error('API ViaCep indisponível')));

    component.form.get('cep')?.setValue('01310-100');
    component.consultarCep();

    expect(component.consultandoCep).toBe(false);
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      expect.stringContaining('Não foi possível consultar a API de CEP'),
      'Fechar',
      expect.any(Object)
    );

    // O formulário continua funcional e os campos editáveis
    expect(component.form.get('cidade')?.enabled).toBe(true);
    expect(component.form.get('uf')?.enabled).toBe(true);
  });

  it('deve permitir preencher CEP e salvar sem necessariamente fazer uma consulta à API', () => {
    component.form.patchValue({
      nomeFantasia: 'Fornecedor Manual',
      razaoSocial: 'Fornecedor Manual LTDA',
      cnpj: '11.222.333/0001-44',
      contatoNome: 'João Silva',
      email: 'joao@fornecedor.com',
      telefone: '(11) 98888-7777',
      cep: '04794-000', // CEP inserido manualmente sem consultar
      cidade: 'São Paulo',
      uf: 'SP',
      prazoEntregaDias: 5,
      status: 'ATIVO',
      marcasFornecidas: ['ColdWheels']
    });

    // Nenhuma chamada à API foi disparada
    expect(mockViaCepService.consultar).not.toHaveBeenCalled();

    expect(component.form.valid).toBe(true);
    component.onSalvar();

    expect(mockDialogRef.close).toHaveBeenCalledWith(expect.objectContaining({
      cep: '04794-000',
      cidade: 'São Paulo',
      uf: 'SP'
    }));
  });
});
