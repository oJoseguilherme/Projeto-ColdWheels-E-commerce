import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { Fornecedor, FornecedorRequest } from '../../../models/fornecedor.model';

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
    MatSelectModule
  ],
  templateUrl: './fornecedor-dialog.html',
  styleUrl: './fornecedor-dialog.css'
})
export class FornecedorDialogComponent implements OnInit {
  form: FormGroup;
  modoEdicao: boolean = false;

  readonly marcasDisponiveis = [
    'Hot Wheels',
    'Matchbox',
    'Majorette',
    'Tomica',
    'Greenlight Collectibles',
    'Siku'
  ];

  readonly ufsDisponiveis = [
    'SP', 'RJ', 'MG', 'PR', 'RS', 'SC', 'BA', 'PE', 'CE', 'AM', 'GO', 'DF', 'ES', 'TO'
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FornecedorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FornecedorDialogData
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
      cidade: [data?.fornecedor?.cidade || '', [Validators.required]],
      uf: [data?.fornecedor?.uf || 'SP', [Validators.required]],
      marcasFornecidas: [data?.fornecedor?.marcasFornecidas || ['Hot Wheels'], [Validators.required]],
      status: [data?.fornecedor?.status || 'ATIVO', [Validators.required]],
      prazoEntregaDias: [data?.fornecedor?.prazoEntregaDias || 5, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {}

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
