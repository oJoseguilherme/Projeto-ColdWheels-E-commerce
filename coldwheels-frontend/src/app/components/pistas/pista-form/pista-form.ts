import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
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

import { Pista, PistaRequest } from '../../../models/pista.model';
import { PistaService } from '../../../services/pista.service';
import { MarcaService } from '../../../services/marca.service';
import { FornecedorService } from '../../../services/fornecedor.service';
import { Marca } from '../../../models/marca.model';
import { Fornecedor } from '../../../models/fornecedor.model';
import { ArquivoService } from '../../../services/arquivo.service';
import {
  ProdutoArquivoPendenteEvent,
  ProdutoImagemAlteradaEvent,
  ProdutoImagemUploadComponent
} from '../../shared/produto-imagem-upload/produto-imagem-upload';

function notBlankValidator(control: AbstractControl): ValidationErrors | null {

  const value = control.value;

  if (typeof value === 'string' && value.trim().length === 0) {
    return { blank: true };
  }

  return null;
}

function integerValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (value === null || value === '') {
    return null;
  }

  return Number.isInteger(Number(value))
    ? null
    : { integer: true };
}

function decimalPlacesValidator(maxPlaces: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === '') {
      return null;
    }

    const text = String(value);
    const decimal = text.split('.')[1];

    return decimal && decimal.length > maxPlaces
      ? { decimalPlaces: true }
      : null;
  };
}

@Component({
  selector: 'app-pista-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    ProdutoImagemUploadComponent
  ],
  templateUrl: './pista-form.html',
  styleUrl: './pista-form.css'
})
export class PistaForm implements OnInit {

  readonly anoAtual = new Date().getFullYear();
  readonly modoEdicao = signal(false);
  readonly salvando = signal(false);

  marcas: Marca[] = [];
  fornecedores: Fornecedor[] = [];
  imagemPrincipalUrl: string | null = null;
  imagemSecundariaUrl: string | null = null;
  private arquivoPrincipalPendente: File | null = null;
  private arquivoSecundarioPendente: File | null = null;
  private readonly arquivoService = inject(ArquivoService);

  pistaId: number | null = null;

  readonly form = new FormGroup({
    nome: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        notBlankValidator,
        Validators.maxLength(120)
      ]
    }),

    descricao: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        notBlankValidator,
        Validators.maxLength(500)
      ]
    }),

    preco: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0.01),
      Validators.max(99_999_999.99),
      decimalPlacesValidator(2)
    ]),

    anoLancamento: new FormControl<number | null>(null, [
      Validators.min(1968),
      Validators.max(new Date().getFullYear()),
      integerValidator
    ]),

    quantidadePecas: new FormControl<number | null>(null, [
      Validators.min(1),
      integerValidator
    ]),

    idadeMinima: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      integerValidator
    ]),

    colecao: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        notBlankValidator,
        Validators.maxLength(100)
      ]
    }),

    estoque: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
      integerValidator
    ]),

    idMarca: new FormControl<number | null>(null),

    idFornecedor: new FormControl<number | null>(null)
  });

  constructor(
    private readonly pistaService: PistaService,
    private readonly marcaService: MarcaService,
    private readonly fornecedorService: FornecedorService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carregarMarcas();
    this.carregarFornecedores();

    const pista = this.route.snapshot.data['pista'] as Pista | undefined;

    if (!pista) {
      return;
    }

    this.modoEdicao.set(true);
    this.pistaId = pista.id;
    this.imagemPrincipalUrl = pista.imagemUrl ?? null;
    this.imagemSecundariaUrl = pista.imagemSecundariaUrl ?? null;

    this.form.patchValue({
      nome: pista.nome,
      descricao: pista.descricao,
      preco: pista.preco,
      anoLancamento: pista.anoLancamento,
      quantidadePecas: pista.quantidadePecas,
      idadeMinima: pista.idadeMinima,
      colecao: pista.colecao,
      estoque: pista.estoque,
      idMarca: pista.marca ? pista.marca.id : (pista.idMarca ?? null),
      idFornecedor: pista.fornecedor ? pista.fornecedor.id : (pista.idFornecedor ?? null)
    });
  }

  carregarMarcas(): void {
    this.marcaService.getMarcas().subscribe({
      next: (dados) => {
        this.marcas = dados;
      },
      error: (err) => {
        console.error('Erro ao buscar marcas:', err);
      }
    });
  }

  carregarFornecedores(): void {
    this.fornecedorService.getFornecedores().subscribe({
      next: (dados) => {
        this.fornecedores = dados;
      },
      error: (err) => {
        console.error('Erro ao buscar fornecedores:', err);
      }
    });
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

    if (
      valores.preco === null ||
      valores.idadeMinima === null ||
      valores.estoque === null
    ) {
      return;
    }

    const pista: PistaRequest = {
      nome: valores.nome.trim(),
      descricao: valores.descricao.trim(),
      preco: valores.preco,
      anoLancamento: valores.anoLancamento,
      quantidadePecas: valores.quantidadePecas,
      idadeMinima: valores.idadeMinima,
      colecao: valores.colecao.trim(),
      estoque: valores.estoque,
      idMarca: valores.idMarca,
      idFornecedor: valores.idFornecedor
    };

    this.salvando.set(true);

    if (this.modoEdicao() && this.pistaId !== null) {
      this.atualizar(this.pistaId, pista);
    } else {
      this.cadastrar(pista);
    }
  }


  voltar(): void {
    this.router.navigate(['/produtos'], { queryParams: { tab: 'pistas' } });
  }

  private cadastrar(pista: PistaRequest): void {
    this.pistaService.create(pista).subscribe({
      next: (criada) => {
        const uploads: Observable<any>[] = [];
        if (this.arquivoPrincipalPendente && criada?.id) {
          uploads.push(this.arquivoService.uploadImagemProduto('pistas', criada.id, 'principal', this.arquivoPrincipalPendente));
        }
        if (this.arquivoSecundarioPendente && criada?.id) {
          uploads.push(this.arquivoService.uploadImagemProduto('pistas', criada.id, 'secundaria', this.arquivoSecundarioPendente));
        }

        if (uploads.length > 0) {
          forkJoin(uploads).subscribe({
            next: () => {
              this.snackBar.open('Pista e imagens cadastradas com sucesso.', 'Ok', { duration: 2500 });
              this.router.navigate(['/produtos'], { queryParams: { tab: 'pistas' } });
            },
            error: () => {
              this.snackBar.open('Pista salva, mas houve erro ao enviar uma das imagens.', 'Fechar', { duration: 3500 });
              this.router.navigate(['/produtos'], { queryParams: { tab: 'pistas' } });
            }
          });
        } else {
          this.snackBar.open(
            'Pista cadastrada com sucesso.',
            'Ok',
            { duration: 2500 }
          );
          this.router.navigate(['/produtos'], { queryParams: { tab: 'pistas' } });
        }
      },
      error: (error: HttpErrorResponse) => {
        this.salvando.set(false);
        this.exibirErro(error, 'Não foi possível cadastrar a pista.');
      }
    });
  }

  onImagemAlterada(event: ProdutoImagemAlteradaEvent): void {
    if (event.slot === 'principal') {
      this.imagemPrincipalUrl = event.imagemUrl;
    } else {
      this.imagemSecundariaUrl = event.imagemUrl;
    }
  }

  onArquivoPendente(event: ProdutoArquivoPendenteEvent): void {
    if (event.slot === 'principal') {
      this.arquivoPrincipalPendente = event.file;
    } else {
      this.arquivoSecundarioPendente = event.file;
    }
  }

  private atualizar(id: number, pista: PistaRequest): void {
    this.pistaService.update(id, pista).subscribe({
      next: () => {
        this.snackBar.open(
          'Pista atualizada com sucesso.',
          'Ok',
          { duration: 2500 }
        );

        this.router.navigate(['/produtos'], { queryParams: { tab: 'pistas' } });
      },
      error: (error: HttpErrorResponse) => {
        this.salvando.set(false);
        this.exibirErro(error, 'Não foi possível atualizar a pista.');
      }
    });
  }

  private exibirErro(
    error: HttpErrorResponse,
    mensagemPadrao: string
  ): void {
    console.error('Erro ao salvar pista:', error);

    let mensagem = mensagemPadrao;

    if (error.status === 0) {
      mensagem = 'Não foi possível conectar ao servidor.';
    } else if (
      typeof error.error === 'object' &&
      error.error !== null &&
      typeof error.error.message === 'string'
    ) {
      mensagem = error.error.message;
    }

    this.snackBar.open(mensagem, 'Fechar', {
      duration: 4000
    });
  }
}