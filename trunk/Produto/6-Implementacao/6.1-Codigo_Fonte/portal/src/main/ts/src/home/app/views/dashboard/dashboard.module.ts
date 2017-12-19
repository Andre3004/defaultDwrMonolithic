import { DateLocale } from 'md2';
import {NgModule, Injectable} from '@angular/core';

import {DashboardViewComponent} from "./dashboard-view.component";
import {AlunoViewComponent} from "../aluno/aluno-view.component";
import {CursoInseridoComponent} from "./meus-cursos/inserir-curso/curso-inserido/curso-inserido.component";
import {AlterarTurmaComponent} from "./meus-cursos/alterar-curso/alterar-curso-dados-turma/alterar-turma/alterar-turma.component";
import {InserirTurmaComponent} from "./meus-cursos/alterar-curso/alterar-curso-dados-turma/inserir-turma/inserir-turma.component";
import {ConsultarTurmasComponent} from "./meus-cursos/alterar-curso/alterar-curso-dados-turma/consultar-turmas/consultar-turmas.component";
import {TurmaViewComponent} from "./meus-cursos/alterar-curso/alterar-curso-dados-turma/turma-view.component";
import {AulaViewComponent} from "./meus-cursos/alterar-curso/alterar-curso-dados-turma/turma-form/aulas/aula-view.component";
import {InserirAulaComponent} from "./meus-cursos/alterar-curso/alterar-curso-dados-turma/turma-form/aulas/inserir-aula/inserir-aula.component";
import {AlterarAulaComponent} from "./meus-cursos/alterar-curso/alterar-curso-dados-turma/turma-form/aulas/alterar-aula/alterar-aula.component";
import {LoteViewComponent} from "./meus-cursos/alterar-curso/alterar-curso-dados-turma/turma-form/lotes/lote-view.component";
import {ConsultarLotesComponent} from "./meus-cursos/alterar-curso/alterar-curso-dados-turma/turma-form/lotes/consultar-lotes/consultar-lotes.component";
import {InserirLoteComponent} from "./meus-cursos/alterar-curso/alterar-curso-dados-turma/turma-form/lotes/inserir-lote/inserir-lote.component";
import {AlterarLoteComponent} from "./meus-cursos/alterar-curso/alterar-curso-dados-turma/turma-form/lotes/alterar-lote/alterar-lote.component";
import {AulaFormComponent} from "./meus-cursos/alterar-curso/alterar-curso-dados-turma/turma-form/aulas/aula-form/aula-form.component";
import {LoteFormComponent} from "./meus-cursos/alterar-curso/alterar-curso-dados-turma/turma-form/lotes/lote-form/lote-form.component";
import {ConsultarCursosComponent} from "./cursos/consultar-cursos/consultar-cursos.component";
import {AlterarCursoComponentView} from "./meus-cursos/alterar-curso/alterar-curso-view.component";
import {InserirAlunoComponent} from "../aluno/inserir-aluno/inserir-aluno.component";
import {VisualizarAlunoComponent} from "../aluno/visualizar-aluno/visualizar-aluno.component";
import {AlterarAlunoComponent} from "../aluno/alterar-aluno/alterar-aluno.component";
import {ConsultarAlunosComponent} from "../aluno/consultar-alunos/consultar-alunos.component";
import {VisualizarInstrutorComponent} from "../instrutor/visualizar-instrutor/visualizar-instrutor.component";
import {VisualizarDadosUsuarioComponent} from "./minha-conta/visualizar-minha-conta/visualizar-dados-usuario/visualizar-dados-usuario.component";
import {MinhaContaViewComponent} from "./minha-conta/minha-conta-view.component";
import {VisualizarMinhaContaComponent} from "./minha-conta/visualizar-minha-conta/visualizar-minha-conta.component";
import {AlterarMinhaContaComponent} from "./minha-conta/alterar-minha-conta/alterar-minha-conta.component";
import {CompraViewComponent} from "../compra/compra-view.component";
import {AlterarCursoComponent} from "./meus-cursos/alterar-curso/alterar-curso.component";
import {InserirCursoComponent} from "./meus-cursos/inserir-curso/inserir-curso.component";
import {CursosViewComponent} from "./cursos/cursos-view.component";
import {ConsultarMeusCursosComponent} from "./meus-cursos/consultar-meus-cursos/consultar-meus-cursos.component";
import {RecomendarOportunidadeDialogComponent} from "../instrutor/recomendar-oportunidade-dialog/recomendar-oportunidade-dialog.component";
import {ConsultarCursosDialogComponent} from "../aluno/consultar-alunos/consultar-cursos-dialog/consultar-cursos-dialog.component";
import {CursoPublicadoComponent} from "./meus-cursos/curso-publicado/curso-publicado.component";
import {InstrutorViewComponent} from "../instrutor/instrutor-view.component";
import {ConsultarInstrutoresComponent} from "../instrutor/consultar-instrutores/consultar-instrutores.component";
import {InserirInstrutorComponent} from "../instrutor/inserir-instrutor/inserir-instrutor.component";
import {AlterarInstrutorComponent} from "../instrutor/alterar-instrutor/alterar-instrutor.component";
import {TurmaFormComponent} from "./meus-cursos/alterar-curso/alterar-curso-dados-turma/turma-form/turma-form.component";
import {StepComponent} from "../../controls/step/step.component";
import {InformacoesBasicasCursoComponent} from "./meus-cursos/inserir-curso/informacoes-basicas-curso/informacoes-basicas-curso.component";
import {DadosCursoComponent} from "./meus-cursos/inserir-curso/informacoes-basicas-curso/dados-curso/dados-curso.component";
import {DadosDepositoComponent} from "./meus-cursos/inserir-curso/informacoes-basicas-curso/dados-deposito/dados-deposito.component";
import {DocumentoPipe} from "../../controls/documento-pipe/documento-pipe";
import {CommonModule} from "@angular/common";
import {LongPressDirective} from "../../controls/long-press/long-press.directive";
import {DadosTurmaComponent} from "./meus-cursos/alterar-curso/alterar-curso-dados-turma/inserir-turma/dados-turma/dados-turma.component";
import {TextMaskModule} from "angular2-text-mask";
import {CurrencyMaskModule} from "ng2-currency-mask";
import {CKEditorModule} from "ng2-ckeditor";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  CovalentDataTableModule,
  CovalentDialogsModule,
  CovalentExpansionPanelModule,
  CovalentLayoutModule,
  CovalentLoadingModule,
  CovalentMessageModule,
  CovalentPagingModule,
  CovalentStepsModule,
  CovalentNotificationsModule,
  CovalentCommonModule
} from "@covalent/core";
import {CovalentHighlightModule} from "@covalent/highlight";
import {
  MatButtonToggleModule,
  MatCheckboxModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTabsModule,
  MatExpansionModule,
  MatStepperModule,
  MatSliderModule
} from "@angular/material";
import {ClipboardModule} from "ngx-clipboard/dist";
import {CadastrarInstrutorDialogComponent} from "./meus-cursos/alterar-curso/alterar-curso-dados-turma/inserir-turma/dados-turma/cadastrar-instrutor-dialog/cadastrar-instrutor-dialog.component";
import {ShareButtonsModule} from "ngx-sharebuttons";
import {dashboardRouting} from "./dashboard-routing.module";
import {CursoSharedModule} from "../curso/curso-shared.module";
import {ConsultarMatriculasDialogComponent} from "../compra/consultar-matriculas-dialog/consultar-matriculas-dialog.component";
import { CursoCardStatusComponent } from './meus-cursos/consultar-meus-cursos/curso-card-status/curso-card-status.component';
import {ConsultarMinhasComprasComponent} from "../compra/consultar-minhas-compras/consultar-minhas-compras.component";
import {ConsultarComprasComponent} from "../compra/consultar-compras/consultar-compras.component";
import {CompraCardStatusComponent} from "../compra/consultar-minhas-compras/compra-card-status/compra-card-status.component";
import { BloquearAlunosComponent } from '../aluno/bloquear-alunos/bloquear-alunos.component';
import { VisualizarCompraComponent } from '../compra/visualizar-compra/visualizar-compra.component';
import { ConsultarBandeiraCartaoComponent } from '../../controls/consultar-bandeira-cartao/consultar-bandeira-cartao.component';
import { TdCollapseAnimation } from '@covalent/core/common/animations/collapse/collapse.animation';
import { CupomDescontoViewComponent } from './meus-cursos/alterar-curso/alterar-curso-dados-turma/turma-form/cupom-desconto/cupom-desconto-view.component';
import { CupomDescontoFormComponent } from './meus-cursos/alterar-curso/alterar-curso-dados-turma/turma-form/cupom-desconto/cupom-desconto-form/cupom-desconto-form.component';
import { InserirCupomDescontoComponent } from './meus-cursos/alterar-curso/alterar-curso-dados-turma/turma-form/cupom-desconto/inserir-cupom-desconto/inserir-cupom-desconto.component';
import { AlterarCupomDescontoComponent } from './meus-cursos/alterar-curso/alterar-curso-dados-turma/turma-form/cupom-desconto/alterar-cupom-desconto/alterar-cupom-desconto.component';

@NgModule({
  declarations: [
    CadastrarInstrutorDialogComponent,
    LongPressDirective,
    AulaViewComponent,
    CupomDescontoViewComponent,
    TurmaViewComponent,
    LoteViewComponent,
    DadosTurmaComponent,
    ConsultarTurmasComponent,
    InserirTurmaComponent,
    AlterarTurmaComponent,
    InserirAulaComponent,
    InserirCupomDescontoComponent,
    AlterarAulaComponent,
    ConsultarLotesComponent,
    InserirLoteComponent,
    AlterarLoteComponent,
    AlterarCupomDescontoComponent,
    AulaFormComponent,
    CupomDescontoFormComponent,
    LoteFormComponent,
    InformacoesBasicasCursoComponent,
    DadosCursoComponent,
    DadosDepositoComponent,
    TurmaFormComponent,
    StepComponent,
    ConsultarCursosComponent,
    AlterarCursoComponentView,
    InserirCursoComponent,
    AlterarCursoComponent,
    CursoInseridoComponent,
    CursoPublicadoComponent,
    CursosViewComponent,
    VisualizarInstrutorComponent,
    ConsultarCursosDialogComponent,
    RecomendarOportunidadeDialogComponent,
    ConsultarMeusCursosComponent,
    BloquearAlunosComponent,
    ConsultarBandeiraCartaoComponent,

    // Usuário
    DashboardViewComponent,
    AlunoViewComponent,
    DocumentoPipe,


    //GERENCIAR TURMA
    CompraViewComponent,
    ConsultarAlunosComponent,
    AlterarAlunoComponent,
    VisualizarAlunoComponent,
    InserirAlunoComponent,
    AlterarMinhaContaComponent,
    VisualizarMinhaContaComponent,
    MinhaContaViewComponent,

    // //Instrutor
    VisualizarDadosUsuarioComponent,
    InstrutorViewComponent,
    ConsultarInstrutoresComponent,
    InserirInstrutorComponent,
    AlterarInstrutorComponent,
    CursoCardStatusComponent,

    //Compra
    ConsultarMinhasComprasComponent,
    ConsultarComprasComponent,
    CompraViewComponent,
    CompraCardStatusComponent,
    VisualizarCompraComponent,
  ],
  imports: [
    MatStepperModule,
    MatSliderModule,
    CursoSharedModule,
    CommonModule,
    dashboardRouting,
    CovalentMessageModule,
    TextMaskModule,
    CurrencyMaskModule,
    CKEditorModule,
    FormsModule,
    ReactiveFormsModule,
    CovalentExpansionPanelModule,
    CovalentPagingModule,
    CovalentLoadingModule,
    CovalentHighlightModule,
    CovalentDialogsModule,
    CovalentDataTableModule,
    CovalentNotificationsModule,
    MatSelectModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    CovalentStepsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    ClipboardModule,
    ShareButtonsModule.forRoot(),
    CovalentLayoutModule,
    MatListModule,
    MatTabsModule,
    MatExpansionModule
  ],
  exports: [
  ],
  entryComponents: [
    ConsultarCursosDialogComponent,
    RecomendarOportunidadeDialogComponent,
    ConsultarMatriculasDialogComponent, // será compartilhado com fora TODO
    CadastrarInstrutorDialogComponent,
    BloquearAlunosComponent
  ],
})
export class DashboardModule {
  constructor(public dateLocale: DateLocale)
  {
    dateLocale.months = {
      'long': [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro',
        'Outubro', 'Novembro', 'Dezembro'
      ],
      'short': ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      'narrow': ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
    };

    dateLocale.daysOfWeek = {
      'long': ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      'short': ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      'narrow': ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
    };
  }
}

