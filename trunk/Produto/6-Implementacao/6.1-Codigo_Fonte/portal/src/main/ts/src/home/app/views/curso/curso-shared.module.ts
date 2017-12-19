import { SafeHtmlPipe } from './../../controls/safe-html-pipe/safe-html-pipe';
import { CurrencyFormatPipe } from './../../controls/currency-pipe-brl/currency-pipe-brl';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CKEditorModule } from "ng2-ckeditor";
import
{
  CovalentChipsModule,
  CovalentCommonModule,
  CovalentDataTableModule,
  CovalentDialogsModule,
  CovalentExpansionPanelModule,
  CovalentFileModule,
  CovalentLayoutModule,
  CovalentLoadingModule,
  CovalentMessageModule,
  CovalentPagingModule,
  CovalentStepsModule
} from "@covalent/core";
import
{
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatTooltipModule,
  MatSliderModule
} from "@angular/material";
import { CovalentHighlightModule } from "@covalent/highlight";
import { CovalentMarkdownModule } from "@covalent/markdown";
import { ClipboardModule } from "ngx-clipboard/dist";
import { TextMaskModule } from "angular2-text-mask";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TermosUsoDialogComponent } from "../../controls/termos-uso/termos-uso-dialog/termos-uso-dialog.component";
import { ConsultarAulasComponent } from "../dashboard/meus-cursos/alterar-curso/alterar-curso-dados-turma/turma-form/aulas/consultar-aulas/consultar-aulas.component";
import { ConsultarCuponsDescontoComponent } from "../dashboard/meus-cursos/alterar-curso/alterar-curso-dados-turma/turma-form/cupom-desconto/consultar-cupons-desconto/consultar-cupons-desconto.component";
import { SharedModule } from "../../shared.module";
import { VisualizarCursoComponent } from "./visualizar-curso/visualizar-curso.component";
import { InstrutoresListComponent } from "./visualizar-curso/visualizar-curso-description/turma-list/instrutores-list/instrutores-list.component";
import { GroupByPipe } from "../../controls/group-by-pipe/group-by";
import { VisualizarCompraComponent } from "../compra/realizar-matriculas/matriculas-realizadas/visualizar-compra/visualizar-compra.component";
import { TextHighlightComponent } from "../../controls/text-highlight/text-highlight.component";
import { VisualizarCursoHeaderComponent } from "./visualizar-curso/visualizar-curso-header/visualizar-curso-header.component";
import { LotesListComponent } from "../../controls/lotes-list/lotes-list.component";
import { CodigoIncorporacaoComponent } from "./codigo-incorporacao/codigo-incorporacao.component";
import { TurmaInfoComponent } from "../compra/realizar-matriculas/turma-info/turma-info.component";
import { VisualizarCursoDescriptionComponent } from "./visualizar-curso/visualizar-curso-description/visualizar-curso-description.component";
import { DadosPagamentoComponent } from "../compra/realizar-matriculas/dados-pagamento/dados-pagamento.component";
import { DadosMatriculaComponent } from "../compra/realizar-matriculas/dados-matricula/dados-matricula.component";
import { ReservaVagasComponent } from "../compra/realizar-matriculas/reserva-vagas/reserva-vagas.component";
import { RealizarMatriculasComponent } from "../compra/realizar-matriculas/realizar-matriculas.component";
import { AvaliacaoCursoComponent } from "./visualizar-curso/visualizar-curso-description/avaliacao-curso/avaliacao-curso.component";
import { OrganizadorPreviewComponent } from "./visualizar-curso/visualizar-curso-description/organizador-preview/organizador-preview.component";
import { TurmaListComponent } from "./visualizar-curso/visualizar-curso-description/turma-list/turma-list.component";
import { ProximaTurmaComponent } from "./visualizar-curso/proxima-turma/proxima-turma.component";
import { RecusarCursoComponent } from "./visualizar-curso/recusar-curso/recusar-curso.component";
import { MatriculasRealizadasComponent } from "../compra/realizar-matriculas/matriculas-realizadas/matriculas-realizadas.component";
import { ShareButtonsModule } from "ngx-sharebuttons";
import { CnpjValidator, CpfValidator, DataNascimentoValidator } from "../../controls/validators/Validators";
import { SomenteLetras } from "../../controls/patterns/somente-letras";
import { SomenteAlfanumericos } from "../../controls/patterns/somente-alfanumericos";
import { ContaSharedModule } from "../conta/conta-shared.module";
import { FaleComOrganizadorComponent } from "./visualizar-curso/visualizar-curso-description/organizador-preview/fale-com-organizador/fale-com-organizador.component";
import { RecaptchaModule } from "ng-recaptcha";
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { CursoCardStatusComponent } from '../dashboard/meus-cursos/consultar-meus-cursos/curso-card-status/curso-card-status.component';
import { ConsultarMatriculasDialogComponent } from "../compra/consultar-matriculas-dialog/consultar-matriculas-dialog.component";
import { HttpClientModule } from '@angular/common/http';
import { Md2DatepickerModule, MdNativeDateModule } from 'md2';


@NgModule({
  declarations: [
    VisualizarCursoComponent,
    ConsultarAulasComponent,
    ConsultarCuponsDescontoComponent,
    FaleComOrganizadorComponent,
    RecusarCursoComponent,
    ProximaTurmaComponent,
    TurmaListComponent,
    OrganizadorPreviewComponent,
    AvaliacaoCursoComponent,
    RealizarMatriculasComponent,
    ReservaVagasComponent,
    DadosMatriculaComponent,
    DadosPagamentoComponent,
    VisualizarCursoDescriptionComponent,
    TurmaInfoComponent,
    CodigoIncorporacaoComponent,
    LotesListComponent,
    VisualizarCursoHeaderComponent,
    MatriculasRealizadasComponent,
    TextHighlightComponent,
    VisualizarCompraComponent,
    GroupByPipe,
    InstrutoresListComponent,
    ConsultarMatriculasDialogComponent,

    // ConfirmDialogComponent
    SomenteLetras,
    SomenteAlfanumericos,
    DataNascimentoValidator,
    CpfValidator,
    CnpjValidator,
    CurrencyFormatPipe,
    SafeHtmlPipe
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ContaSharedModule,
    CommonModule,
    MatSliderModule,

    CovalentMessageModule,


    TextMaskModule,

    CKEditorModule,
    CovalentFileModule,
    CovalentExpansionPanelModule,
    CovalentPagingModule,
    CovalentLoadingModule,
    CovalentHighlightModule,
    CovalentDialogsModule,
    CovalentDataTableModule,
    CovalentStepsModule,
    CovalentLayoutModule,
    ClipboardModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatListModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
    HttpClientModule,
    ShareButtonsModule.forRoot()
  ],
  exports: [
    FaleComOrganizadorComponent,
    ReactiveFormsModule,
    TextHighlightComponent,
    FormsModule,
    ContaSharedModule,
    SharedModule,
    ConsultarAulasComponent,
    ConsultarCuponsDescontoComponent,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    CovalentChipsModule,

    CovalentCommonModule,
    CovalentMarkdownModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatSidenavModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    MatSliderModule,

    Md2DatepickerModule,
    MdNativeDateModule,

    MatSnackBarModule, // Utilizado pelas dialog's

    RouterModule,

    SomenteLetras,
    SomenteAlfanumericos,
    DataNascimentoValidator,
    CpfValidator,
    CnpjValidator,
    RecusarCursoComponent,
    RecaptchaModule,
    GroupByPipe,
    InstrutoresListComponent,
    HttpClientModule,
    CurrencyFormatPipe,
    SafeHtmlPipe
  ], entryComponents: [
    CodigoIncorporacaoComponent,
    TermosUsoDialogComponent,
    RecusarCursoComponent,
    FaleComOrganizadorComponent
  ],
})
export class CursoSharedModule { }
