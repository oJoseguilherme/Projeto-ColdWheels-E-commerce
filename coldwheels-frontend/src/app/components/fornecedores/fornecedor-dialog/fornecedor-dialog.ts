import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Fornecedor, FornecedorRequest } from '../../../models/fornecedor.model';
import { ViaCepService } from '../../../services/via-cep.service';
import { CnpjMaskDirective } from '../../../directives/cnpj-mask.directive';

export interface FornecedorDialogData {
  fornecedor?: Fornecedor;
}

@Component({
  selector: 'app-fornecedor-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    CnpjMaskDirective
  ],
  templateUrl: './fornecedor-dialog.html',
  styleUrl: './fornecedor-dialog.css'
})
export class FornecedorDialogComponent implements OnInit {
  form: FormGroup;
  modoEdicao: boolean = false;
  consultandoCep: boolean = false;

  readonly marcasDisponiveis = [
    'ColdWheels',
    'ColdWheels (Mattel)',
    'Matchbox',
    'Majorette',
    'Tomica',
    'Tomica (Takara Tomy)',
    'Greenlight Collectibles',
    'Siku'
  ];

  readonly ufsDisponiveis = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FornecedorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FornecedorDialogData,
    private viaCepService: ViaCepService,
    private snackBar: MatSnackBar
  ) {
    this.modoEdicao = !!data?.fornecedor;

    this.form = this.fb.group({
      id: [data?.fornecedor?.id || null],
      nomeFantasia: [data?.fornecedor?.nomeFantasia || '', [Validators.required]],
      razaoSocial: [data?.fornecedor?.razaoSocial || '', [Validators.required]],
      cnpj: [data?.fornecedor?.cnpj || '', [Validators.required]],
      contatoNome: [data?.fornecedor?.contatoNome || '', [Validators.required]],
      email: [data?.fornecedor?.email || '', [Validators.required, Validators.email]],
      telefone: [data?.fornecedor?.telefone || '', [Validators.required]],
      cep: [data?.fornecedor?.cep || '', [Validators.pattern(/^$|^\d{5}-?\d{3}$|^\d{8}$/)]],
      cidade: [data?.fornecedor?.cidade || '', [Validators.required]],
      uf: [data?.fornecedor?.uf || 'SP', [Validators.required]],
      marcasFornecidas: [data?.fornecedor?.marcasFornecidas || ['ColdWheels'], [Validators.required]],
      status: [data?.fornecedor?.status || 'ATIVO', [Validators.required]],
      prazoEntregaDias: [data?.fornecedor?.prazoEntregaDias || 5, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {}

  consultarCep(): void {
    const cepBruto = this.form.get('cep')?.value || '';
    const cepLimpo = cepBruto.toString().replace(/\D/g, '');

    if (!cepLimpo) {
      this.snackBar.open('Informe o CEP para realizar a consulta.', 'Fechar', {
        duration: 3000
      });
      return;
    }

    if (cepLimpo.length !== 8) {
      this.snackBar.open('O CEP deve conter 8 dígitos numéricos.', 'Fechar', {
        duration: 3000
      });
      return;
    }

    this.consultandoCep = true;

    this.viaCepService.consultar(cepLimpo).subscribe({
      next: (resultado) => {
        this.consultandoCep = false;

        if (resultado.erro) {
          this.snackBar.open(
            'CEP não encontrado na base de dados. Você pode preencher Cidade e UF manualmente.',
            'Fechar',
            { duration: 4000 }
          );
          return;
        }

        const updates: Partial<{ cidade: string; uf: string }> = {};

        if (resultado.localidade) {
          updates.cidade = resultado.localidade;
        }

        if (resultado.uf) {
          const ufUpper = resultado.uf.trim().toUpperCase();
          if (this.ufsDisponiveis.includes(ufUpper)) {
            updates.uf = ufUpper;
          }
        }

        // Atualiza os campos automaticamente sem travá-los (continuam livres para edição)
        this.form.patchValue(updates);

        this.snackBar.open(
          'Localização preenchida via CEP. Os campos continuam disponíveis para edição se necessário.',
          'Ok',
          { duration: 3500 }
        );
      },
      error: () => {
        this.consultandoCep = false;
        // Independência da API: Não trava nem bloqueia o formulário em caso de queda da API
        this.snackBar.open(
          'Não foi possível consultar a API de CEP no momento. Você pode preencher a Cidade e UF manualmente.',
          'Fechar',
          { duration: 4500 }
        );
      }
    });
  }

  onSalvar(): void {
    if (this.form.invalid) {
      return;
    }

    const valor: FornecedorRequest = this.form.value;
    this.dialogRef.close(valor);
  }

  onCancelar(): void {
    this.dialogRef.close(null);
  }
}
