import { Location } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { CarrinhoService } from '../../../services/carrinho.service';
import { CategoriaService } from '../../../services/categoria.service';
import { MarcaService } from '../../../services/marca.service';
import { FornecedorService } from '../../../services/fornecedor.service';
import { Categoria } from '../../../models/categoria.model';
import { Marca } from '../../../models/marca.model';
import { Fornecedor } from '../../../models/fornecedor.model';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';
import {
  ProdutoArquivoPendenteEvent,
  ProdutoImagemAlteradaEvent,
  ProdutoImagemUploadComponent
} from '../../shared/produto-imagem-upload/produto-imagem-upload';
import { ArquivoService } from '../../../services/arquivo.service';
import { PrecoMaskDirective } from '../../../directives/preco-mask.directive';

@Component({
  selector: 'app-carrinho-form',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    PrecoMaskDirective,
    ProdutoImagemUploadComponent
  ],
  templateUrl: './carrinho-form.html',
  styleUrl: './carrinho-form.css',
})
export class CarrinhoForm implements OnInit {
  readonly form: FormGroup;
  categorias: Categoria[] = [];
  marcas: Marca[] = [];
  fornecedores: Fornecedor[] = [];
  imagemPrincipalUrl: string | null = null;
  imagemSecundariaUrl: string | null = null;
  private arquivoPrincipalPendente: File | null = null;
  private arquivoSecundarioPendente: File | null = null;
  private readonly location = inject(Location);
  private readonly arquivoService = inject(ArquivoService);

  constructor(
    private fb: FormBuilder,
    private carrinhoService: CarrinhoService,
    private categoriaService: CategoriaService,
    private marcaService: MarcaService,
    private fornecedorService: FornecedorService,
    private activatedRoute: ActivatedRoute,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {
    // Definimos os campos do formulário e validações
    this.form = this.fb.group({
      id: [null],
      nome: ['', [Validators.required]],
      descricao: [''],
      idCategoria: [null, [Validators.required]],
      idMarca: [null],
      idFornecedor: [null],
      escala: ['1:64', [Validators.required]],
      anoLancamento: [new Date().getFullYear(), [Validators.required]],
      cor: ['', [Validators.required]],
      preco: [null, [Validators.required, Validators.min(0.01)]],
      estoque: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarMarcas();
    this.carregarFornecedores();

    // Se estiver editando, o Resolver entrega o carrinho aqui!
    const carrinho = this.activatedRoute.snapshot.data['carrinho'];
    if (carrinho) {
      this.imagemPrincipalUrl = carrinho.imagemUrl ?? null;
      this.imagemSecundariaUrl = carrinho.imagemSecundariaUrl ?? null;
      this.form.patchValue({
        ...carrinho,
        idCategoria: carrinho.categoria ? carrinho.categoria.id : (carrinho.idCategoria ?? null),
        idMarca: carrinho.marca ? carrinho.marca.id : (carrinho.idMarca ?? null),
        idFornecedor: carrinho.fornecedor ? carrinho.fornecedor.id : (carrinho.idFornecedor ?? null)
      });
    }
  }

  carregarCategorias(): void {
    this.categoriaService.findAll().subscribe({
      next: (cats) => {
        this.categorias = cats;
      },
      error: (err) => {
        console.error('Erro ao buscar categorias:', err);
        this.exibirMensagem('Erro ao carregar categorias.');
      }
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
      this.exibirMensagem('Preencha todos os campos obrigatórios!');
      return;
    }

    const dados = this.form.value;

    if (dados.id) {
      // Caso de Edição (update)
      this.carrinhoService.update(dados.id, dados).subscribe({
        next: () => {
          this.exibirMensagem('Carrinho atualizado com sucesso!');
          this.router.navigate(['/produtos'], { queryParams: { tab: 'carrinhos' } });
        },
        error: (err) => {
          console.error('Erro ao atualizar:', err);
          this.exibirMensagem('Erro ao atualizar o carrinho.');
        }
      });
    } else {
      // Caso de Criação (create)
      this.carrinhoService.create(dados).subscribe({
        next: (criado) => {
          const uploads: Observable<any>[] = [];
          if (this.arquivoPrincipalPendente && criado?.id) {
            uploads.push(this.arquivoService.uploadImagemProduto('carrinhos', criado.id, 'principal', this.arquivoPrincipalPendente));
          }
          if (this.arquivoSecundarioPendente && criado?.id) {
            uploads.push(this.arquivoService.uploadImagemProduto('carrinhos', criado.id, 'secundaria', this.arquivoSecundarioPendente));
          }

          if (uploads.length > 0) {
            forkJoin(uploads).subscribe({
              next: () => {
                this.exibirMensagem('Carrinho e imagens cadastrados com sucesso!');
                this.router.navigate(['/produtos'], { queryParams: { tab: 'carrinhos' } });
              },
              error: () => {
                this.exibirMensagem('Carrinho salvo, mas houve erro ao enviar uma das imagens.');
                this.router.navigate(['/produtos'], { queryParams: { tab: 'carrinhos' } });
              }
            });
          } else {
            this.exibirMensagem('Carrinho cadastrado com sucesso!');
            this.router.navigate(['/produtos'], { queryParams: { tab: 'carrinhos' } });
          }
        },
        error: (err) => {
          console.error('Erro ao cadastrar:', err);
          this.exibirMensagem('Erro ao cadastrar o carrinho.');
        }
      });
    }
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

  excluir(): void {
    const id = this.form.value.id;
    const nome = this.form.value.nome || 'este carrinho';
    if (!id) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'cw-dialog-panel',
      data: {
        titulo: 'Excluir Carrinho',
        mensagem: 'Tem certeza que gostaria de apagar?',
        nomeItem: nome,
        textoConfirmar: 'Sim',
        textoCancelar: 'Não'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.carrinhoService.delete(id).subscribe({
          next: () => {
            this.exibirMensagem('Carrinho excluído com sucesso!');
            this.router.navigate(['/produtos'], { queryParams: { tab: 'carrinhos' } });
          },
          error: (err) => {
            console.error('Erro ao excluir:', err);
            this.exibirMensagem('Erro ao excluir o carrinho.');
          }
        });
      }
    });
  }

  exibirMensagem(msg: string): void {
    this.snack.open(msg, 'Ok', {
      duration: 2500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  voltar(): void {
    this.router.navigate(['/produtos'], { queryParams: { tab: 'carrinhos' } });
  }
}
