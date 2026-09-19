import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { Pista, PistaRequest } from '../../../models/pista.model';
import { PistaService } from '../../../services/pista.service';

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
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './pista-form.html',
  styleUrl: './pista-form.css'
})
export class PistaForm implements OnInit {

  readonly anoAtual = new Date().getFullYear();
  readonly modoEdicao = signal(false);
  readonly salvando = signal(false);

  private pistaId: number | null = null;

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
      Validators.required,
      Validators.min(1968),
      Validators.max(new Date().getFullYear()),
      integerValidator
    ]),

    quantidadePecas: new FormControl<number | null>(null, [
      Validators.required,
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
    ])
  });

  constructor(
    private readonly pistaService: PistaService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const pista = this.route.snapshot.data['pista'] as Pista | undefined;

    if (!pista) {
      return;
    }

    this.modoEdicao.set(true);
    this.pistaId = pista.id;

    this.form.patchValue({
      nome: pista.nome,
      descricao: pista.descricao,
      preco: pista.preco,
      anoLancamento: pista.anoLancamento,
      quantidadePecas: pista.quantidadePecas,
      idadeMinima: pista.idadeMinima,
      colecao: pista.colecao,
      estoque: pista.estoque
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
      valores.anoLancamento === null ||
      valores.quantidadePecas === null ||
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
      estoque: valores.estoque
    };

    this.salvando.set(true);

    if (this.modoEdicao() && this.pistaId !== null) {
      this.atualizar(this.pistaId, pista);
    } else {
      this.cadastrar(pista);
    }
  }

  private cadastrar(pista: PistaRequest): void {
    this.pistaService.create(pista).subscribe({
      next: () => {
        this.snackBar.open(
          'Pista cadastrada com sucesso.',
          'Ok',
          { duration: 2500 }
        );

        this.router.navigate(['/pistas']);
      },
      error: (error: HttpErrorResponse) => {
        this.salvando.set(false);
        this.exibirErro(error, 'Não foi possível cadastrar a pista.');
      }
    });
  }

  private atualizar(id: number, pista: PistaRequest): void {
    this.pistaService.update(id, pista).subscribe({
      next: () => {
        this.snackBar.open(
          'Pista atualizada com sucesso.',
          'Ok',
          { duration: 2500 }
        );

        this.router.navigate(['/pistas']);
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