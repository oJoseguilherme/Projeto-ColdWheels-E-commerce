import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import {
  Cliente,
  ClienteRequest,
  Estado,
  Municipio
} from '../../../models/cliente.model';
import { ClienteService } from '../../../services/cliente.service';
import { GeografiaService } from '../../../services/geografia.service';
import { ViaCepService } from '../../../services/via-cep.service';

function notBlankValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;

  if (typeof value === 'string' && value.trim().length === 0) {
    return { blank: true };
  }

  return null;
}

function cpfValidator(control: AbstractControl): ValidationErrors | null {
  const cpf = somenteDigitos(control.value);

  if (!cpf) {
    return null;
  }

  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) {
    return { cpf: true };
  }

  const calcularDigito = (quantidade: number): number => {
    let soma = 0;
    let peso = quantidade + 1;

    for (let i = 0; i < quantidade; i++) {
      soma += Number(cpf.charAt(i)) * peso;
      peso--;
    }

    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const primeiro = calcularDigito(9);
  const segundo = calcularDigito(10);

  return (
    primeiro === Number(cpf.charAt(9)) &&
    segundo === Number(cpf.charAt(10))
  )
    ? null
    : { cpf: true };
}

function dataNaoFuturaValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return null;
  }

  const hoje = new Date();
  const data = new Date(`${value}T00:00:00`);

  hoje.setHours(0, 0, 0, 0);

  return data.getTime() <= hoje.getTime()
    ? null
    : { dataFutura: true };
}

function somenteDigitos(value: unknown): string {
  return typeof value === 'string'
    ? value.replace(/\D/g, '')
    : '';
}

@Component({
  selector: 'app-cliente-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css'
})
export class ClienteForm implements OnInit {

  readonly modoEdicao = signal(false);
  readonly salvando = signal(false);
  readonly consultandoCep = signal(false);
  readonly carregandoMunicipios = signal(false);
  readonly estados = signal<Estado[]>([]);
  readonly municipios = signal<Municipio[]>([]);

  readonly hoje = new Date().toISOString().slice(0, 10);

  private clienteId: number | null = null;

  readonly enderecoForm = new FormGroup({
    cep: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/^\d{8}$/)
      ]
    }),
    logradouro: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        notBlankValidator,
        Validators.maxLength(150)
      ]
    }),
    numero: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        notBlankValidator,
        Validators.maxLength(30)
      ]
    }),
    complemento: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(120)]
    }),
    bairro: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        notBlankValidator,
        Validators.maxLength(120)
      ]
    }),
    estado: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    codigoIbgeMunicipio: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/^\d{7}$/)
      ]
    })
  });

  readonly form = new FormGroup({
    nome: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        notBlankValidator,
        Validators.minLength(2),
        Validators.maxLength(120)
      ]
    }),
    cpf: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/^\d{11}$/),
        cpfValidator
      ]
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email,
        Validators.maxLength(254)
      ]
    }),
    dataNascimento: new FormControl<string | null>(null, [
      dataNaoFuturaValidator
    ]),
    telefone: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.pattern(/^$|^\d{10,11}$/)
      ]
    }),
    endereco: this.enderecoForm
  });

  constructor(
    private readonly clienteService: ClienteService,
    private readonly geografiaService: GeografiaService,
    private readonly viaCepService: ViaCepService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const cliente = this.route.snapshot.data['cliente'] as Cliente | undefined;

    this.carregarEstados();

    if (!cliente) {
      return;
    }

    this.modoEdicao.set(true);
    this.clienteId = cliente.id;

    this.form.patchValue({
      nome: cliente.nome,
      cpf: cliente.cpf,
      email: cliente.email,
      dataNascimento: cliente.dataNascimento,
      telefone: cliente.telefone ?? '',
      endereco: {
        cep: cliente.endereco.cep,
        logradouro: cliente.endereco.logradouro,
        numero: cliente.endereco.numero,
        complemento: cliente.endereco.complemento ?? '',
        bairro: cliente.endereco.bairro,
        estado: cliente.endereco.municipio.estado.sigla,
        codigoIbgeMunicipio: cliente.endereco.municipio.codigoIbge
      }
    });

    this.carregarMunicipios(
      cliente.endereco.municipio.estado.sigla,
      cliente.endereco.municipio.codigoIbge
    );
  }

  consultarCep(): void {
    const cepControl = this.enderecoForm.controls.cep;
    const cep = somenteDigitos(cepControl.value);

    cepControl.setValue(cep);
    this.removerErrosDeConsultaCep();

    if (!/^\d{8}$/.test(cep)) {
      cepControl.markAsTouched();
      cepControl.setErrors({
        ...cepControl.errors,
        pattern: true
      });
      return;
    }

    this.consultandoCep.set(true);

    this.viaCepService.consultar(cep).subscribe({
      next: (resultado) => {
        if (resultado.erro) {
          cepControl.setErrors({
            ...cepControl.errors,
            cepNaoEncontrado: true
          });
          cepControl.markAsTouched();

          this.snackBar.open(
            'CEP não encontrado.',
            'Fechar',
            { duration: 3000 }
          );

          this.consultandoCep.set(false);
          return;
        }

        const uf = resultado.uf?.trim().toUpperCase();
        const codigoIbge = resultado.ibge?.trim();

        if (!uf || !codigoIbge) {
          this.tratarFalhaConsultaCep(
            'A consulta do CEP não retornou município e UF válidos.'
          );
          return;
        }

        const estado = this.estados()
          .find(item => item.sigla === uf);

        if (!estado) {
          this.tratarFalhaConsultaCep(
            'A UF retornada pelo CEP não está disponível no sistema.'
          );
          return;
        }

        this.enderecoForm.patchValue({
          logradouro: resultado.logradouro?.trim() ?? '',
          bairro: resultado.bairro?.trim() ?? '',
          estado: estado.sigla
        });

        this.carregarMunicipios(
          estado.sigla,
          codigoIbge,
          true
        );
      },
      error: () => {
        this.tratarFalhaConsultaCep(
          'Não foi possível consultar o CEP. Tente novamente.'
        );
      }
    });
  }

  onEstadoChange(uf: string): void {
    this.enderecoForm.controls.codigoIbgeMunicipio.setValue('');
    this.carregarMunicipios(uf);
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      this.snackBar.open(
        'Verifique os campos do formulário.',
        'Fechar',
        { duration: 3000 }
      );

      return;
    }

    const valores = this.form.getRawValue();
    const endereco = valores.endereco;

    const request: ClienteRequest = {
      nome: valores.nome.trim(),
      cpf: somenteDigitos(valores.cpf),
      email: valores.email.trim().toLowerCase(),
      dataNascimento: valores.dataNascimento || null,
      telefone: somenteDigitos(valores.telefone) || null,
      endereco: {
        cep: somenteDigitos(endereco.cep),
        logradouro: endereco.logradouro.trim(),
        numero: endereco.numero.trim(),
        complemento: endereco.complemento.trim() || null,
        bairro: endereco.bairro.trim(),
        codigoIbgeMunicipio: endereco.codigoIbgeMunicipio
      }
    };

    this.salvando.set(true);

    if (this.modoEdicao() && this.clienteId !== null) {
      this.atualizar(this.clienteId, request);
    } else {
      this.cadastrar(request);
    }
  }

  private carregarEstados(): void {
    this.geografiaService.findEstados().subscribe({
      next: (estados) => {
        this.estados.set(estados);
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(
          this.obterMensagemErro(
            error,
            'Não foi possível carregar os Estados.'
          ),
          'Fechar',
          { duration: 3000 }
        );
      }
    });
  }

  private carregarMunicipios(
    uf: string,
    codigoSelecionado?: string,
    origemCep = false
  ): void {
    if (!uf) {
      this.municipios.set([]);
      return;
    }

    this.carregandoMunicipios.set(true);

    this.geografiaService.findMunicipiosByUf(uf).subscribe({
      next: (municipios) => {
        this.municipios.set(municipios);

        if (codigoSelecionado) {
          const municipio = municipios.find(
            item => item.codigoIbge === codigoSelecionado
          );

          if (municipio) {
            this.enderecoForm.controls.codigoIbgeMunicipio
              .setValue(municipio.codigoIbge);
          } else {
            this.enderecoForm.controls.codigoIbgeMunicipio
              .setValue('');

            if (origemCep) {
              this.snackBar.open(
                'O município retornado pelo CEP não está disponível na base geográfica.',
                'Fechar',
                { duration: 3500 }
              );
            }
          }
        }

        this.carregandoMunicipios.set(false);

        if (origemCep) {
          this.consultandoCep.set(false);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.carregandoMunicipios.set(false);

        if (origemCep) {
          this.consultandoCep.set(false);
        }

        this.snackBar.open(
          this.obterMensagemErro(
            error,
            'Não foi possível carregar os Municípios.'
          ),
          'Fechar',
          { duration: 3000 }
        );
      }
    });
  }

  private cadastrar(cliente: ClienteRequest): void {
    this.clienteService.create(cliente).subscribe({
      next: () => {
        this.snackBar.open(
          'Cliente cadastrado com sucesso.',
          'Ok',
          { duration: 2500 }
        );

        this.router.navigate(['/clientes']);
      },
      error: (error: HttpErrorResponse) => {
        this.salvando.set(false);
        this.exibirErro(
          error,
          'Não foi possível cadastrar o cliente.'
        );
      }
    });
  }

  private atualizar(
    id: number,
    cliente: ClienteRequest
  ): void {
    this.clienteService.update(id, cliente).subscribe({
      next: () => {
        this.snackBar.open(
          'Cliente atualizado com sucesso.',
          'Ok',
          { duration: 2500 }
        );

        this.router.navigate(['/clientes']);
      },
      error: (error: HttpErrorResponse) => {
        this.salvando.set(false);
        this.exibirErro(
          error,
          'Não foi possível atualizar o cliente.'
        );
      }
    });
  }

  private removerErrosDeConsultaCep(): void {
    const control = this.enderecoForm.controls.cep;

    if (!control.errors) {
      return;
    }

    const {
      cepNaoEncontrado: _cepNaoEncontrado,
      consultaCep: _consultaCep,
      ...outrosErros
    } = control.errors;

    control.setErrors(
      Object.keys(outrosErros).length > 0
        ? outrosErros
        : null
    );
  }

  private tratarFalhaConsultaCep(mensagem: string): void {
    const control = this.enderecoForm.controls.cep;

    control.setErrors({
      ...control.errors,
      consultaCep: true
    });
    control.markAsTouched();

    this.consultandoCep.set(false);

    this.snackBar.open(
      mensagem,
      'Fechar',
      { duration: 3500 }
    );
  }

  private exibirErro(
    error: HttpErrorResponse,
    mensagemPadrao: string
  ): void {
    this.snackBar.open(
      this.obterMensagemErro(error, mensagemPadrao),
      'Fechar',
      { duration: 3500 }
    );
  }

  private obterMensagemErro(
    error: HttpErrorResponse,
    mensagemPadrao: string
  ): string {
    if (error.status === 0) {
      return 'Não foi possível conectar ao servidor.';
    }

    if (
      typeof error.error === 'object' &&
      error.error !== null &&
      typeof error.error.message === 'string'
    ) {
      return error.error.message;
    }

    return mensagemPadrao;
  }
}
