import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { MarcaService, Marca, ResumoMarcas } from '../../services/marca.service';
import { SidebarService } from '../../services/sidebar.service';
import { VelocimetroComponent } from '../velocimetro/velocimetro';
import { MarcaDialogComponent } from './marca-dialog/marca-dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog';
import { ItemDetailDialogComponent } from '../shared/item-detail-dialog/item-detail-dialog';

@Component({
  selector: 'app-marcas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatDialogModule,
    VelocimetroComponent
  ],
  templateUrl: './marcas.html',
  styleUrl: './marcas.css'
})
export class Marcas implements OnInit {
  resumo: ResumoMarcas = { totalMarcas: 0, totalPaises: 0 };
  marcas: Marca[] = [];

  constructor(
    private marcaService: MarcaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public sidebarService: SidebarService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.marcaService.getResumo().subscribe({
      next: (r) => {
        this.resumo = r;
        this.cdr.markForCheck();
      },
      error: () => {
        console.warn('Não foi possível obter resumo de marcas da API.');
        this.cdr.markForCheck();
      }
    });

    this.marcaService.getMarcas().subscribe({
      next: (m) => {
        this.marcas = m;
        this.cdr.markForCheck();
      },
      error: () => {
        this.marcas = [];
        this.cdr.markForCheck();
        this.snackBar.open('Falha ao carregar lista de marcas da API.', 'Tentar Novamente', {
          duration: 5000
        }).onAction().subscribe(() => this.carregarDados());
      }
    });
  }

  obterOrigemFormatada(marca: Marca): string {
    const bandeira = marca.bandeiraPais || '🌐';
    const pais = marca.paisOrigem || '';
    const p = pais.toLowerCase().trim();

    let sigla = '';
    if (p.includes('estados unidos') || p.includes('eua') || p.includes('usa')) sigla = 'EUA';
    else if (p.includes('reino unido') || p.includes('inglaterra') || p.includes('uk')) sigla = 'UK';
    else if (p.includes('frança') || p.includes('france')) sigla = 'FRA';
    else if (p.includes('japão') || p.includes('japan')) sigla = 'JPN';
    else if (p.includes('alemanha') || p.includes('germany')) sigla = 'GER';
    else if (p.includes('itália') || p.includes('italy')) sigla = 'ITA';
    else if (p.includes('brasil')) sigla = 'BRA';
    else if (p.includes('espanha')) sigla = 'ESP';
    else if (p.includes('china')) sigla = 'CHN';
    else if (p.includes('canadá')) sigla = 'CAN';
    else if (pais.length <= 4) sigla = pais.toUpperCase();
    else sigla = pais.substring(0, 3).toUpperCase();

    return `${bandeira} ${pais} • ${sigla}`;
  }

  abrirModalNovaMarca(): void {
    const dialogRef = this.dialog.open(MarcaDialogComponent, {
      panelClass: 'cw-dialog-panel',
      width: '480px'
    });

    dialogRef.afterClosed().subscribe(dadosMarca => {
      if (dadosMarca) {
        this.marcaService.criarMarca(dadosMarca).subscribe({
          next: (marcaCriada) => {
            this.snackBar.open(`Marca "${marcaCriada.nome}" cadastrada com sucesso!`, 'Ok', {
              duration: 2500
            });
            this.carregarDados();
          },
          error: () => {
            this.snackBar.open('Erro ao cadastrar marca.', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }

  editarMarca(marca: Marca): void {
    const dialogRef = this.dialog.open(MarcaDialogComponent, {
      panelClass: 'cw-dialog-panel',
      width: '480px',
      data: { marca }
    });

    dialogRef.afterClosed().subscribe(dadosAtualizados => {
      if (dadosAtualizados) {
        this.marcaService.atualizarMarca(dadosAtualizados).subscribe({
          next: (marcaAtualizada) => {
            this.snackBar.open(`Marca "${marcaAtualizada.nome}" atualizada com sucesso!`, 'Ok', {
              duration: 2500
            });
            this.carregarDados();
          },
          error: () => {
            this.snackBar.open('Erro ao atualizar marca.', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }

  excluirMarca(marca: Marca): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'cw-dialog-panel',
      data: {
        titulo: 'Excluir Marca',
        mensagem: 'Tem certeza que gostaria de apagar?',
        nomeItem: marca.nome,
        textoConfirmar: 'Sim',
        textoCancelar: 'Não'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.marcaService.excluirMarca(marca.id).subscribe({
          next: () => {
            this.snackBar.open(`Marca "${marca.nome}" excluída com sucesso.`, 'Ok', {
              duration: 2500
            });
            this.carregarDados();
          },
          error: () => {
            this.snackBar.open('Erro ao excluir marca.', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }

  abrirDetalhes(marca: Marca): void {
    this.dialog.open(ItemDetailDialogComponent, {
      panelClass: 'cw-card-flip-dialog',
      maxWidth: '680px',
      width: '92vw',
      data: {
        tipo: 'marca',
        titulo: marca.nome,
        subtitulo: 'Fabricante Licenciado Oficial',
        imagemUrl: marca.logoUrl,
        badgeTopoDireito: this.obterOrigemFormatada(marca),
        descricao: `Marca fabricante e licenciada oficial de miniaturas die-cast e pistas com distribuição autorizada no ecossistema ColdWheels.`,
        atributos: [
          { label: 'País de Origem', valor: `${marca.bandeiraPais || ''} ${marca.paisOrigem || 'Não informado'}`, icone: 'public' },
          { label: 'Modelos no Catálogo', valor: `${marca.totalProdutos} produtos cadastrados`, icone: 'directions_car' },
          { label: 'Status da Licença', valor: 'Licença Ativa', icone: 'verified' }
        ]
      }
    });
  }
}
