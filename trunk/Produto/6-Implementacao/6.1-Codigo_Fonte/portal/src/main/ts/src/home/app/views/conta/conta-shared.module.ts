import {NgModule} from '@angular/core';
import {contaRouting} from "./conta.routing";
import {CriarContaAlunoComponent} from "../aluno/criar-conta-aluno/criar-conta-aluno.component";
import {CriarContaInstrutorComponent} from "../instrutor/criar-conta-instrutor/criar-conta-instrutor.component";
import {UsuarioFormComponent} from "../aluno/alterar-aluno/usuario-form/usuario-form.component";
import {UsuarioPessoaFisicaFormComponent} from "../aluno/alterar-aluno/usuario-form/pessoa-fisica/usuario-pessoa-fisica-form.component";
import {UsuarioPessoaJuridicaFormComponent} from "../aluno/alterar-aluno/usuario-form/pessoa-juridica/usuario-pessoa-juridica-form.component";
import {SharedModule} from "../../shared.module";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TextMaskModule} from "angular2-text-mask";
import {PasswordFormComponent} from "../aluno/alterar-aluno/usuario-form/password/password-form.component";
import {CovalentFileModule} from "@covalent/core";
import {AreasConhecimentoComponent} from "../aluno/inserir-aluno/areas-conhecimento/areas-conhecimento.component";
import {MapsComponent} from "../../controls/maps/maps.component";
import {AgmCoreModule} from "@agm/core";
import {MapComponent} from "../curso/visualizar-curso/visualizar-curso-description/turma-list/map/map.component";
import { MatCheckboxModule, MatInputModule, MatRadioModule, MatSelectModule, MatSlideToggleModule, MatAutocompleteModule } from "@angular/material";
import {Angulartics2Module} from "angulartics2";
import {AlterarMinhaSenhaComponent} from "../dashboard/minha-conta/alterar-minha-senha/alterar-minha-senha.component";
import {SugerirAreaConhecimentoComponent} from "../area-conhecimento/sugerir-area-conhecimento/sugerir-area-conhecimento.component";
import {NoSubmitDirective} from "../../controls/no-sumbit/no-submit.directive";
import {RecuperarSenhaComponent} from "./recuperar-acesso/recuperar-senha/recuperar-senha.component";
import {RecuperarAcessoViewComponent} from "./recuperar-acesso/recuperar-acesso-view.component";
import {RedefinirSenhaComponent} from "./recuperar-acesso/redefinir-senha/redefinir-senha.component";
import {CompletarCadastroAlunoComponent} from "./completar-cadastro-aluno/completar-cadastro-aluno.component";
import {CompletarCadastroInstrutorComponent} from "./completar-cadastro-instrutor/completar-cadastro-instrutor.component";
import { DocumentoEstrangeiroComponent } from '../aluno/alterar-aluno/usuario-form/documento-estrangeiro/documento-estrangeiro.component';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

@NgModule({
  declarations: [

    CriarContaInstrutorComponent,
    CriarContaAlunoComponent,
    AlterarMinhaSenhaComponent,
    RecuperarAcessoViewComponent,
    RecuperarSenhaComponent,
    RedefinirSenhaComponent,
    CompletarCadastroAlunoComponent,
    CompletarCadastroInstrutorComponent,

    UsuarioFormComponent,
    UsuarioPessoaFisicaFormComponent,
    UsuarioPessoaJuridicaFormComponent,
    PasswordFormComponent,
    AreasConhecimentoComponent,
    MapsComponent,
    MapComponent,
    SugerirAreaConhecimentoComponent,
    NoSubmitDirective,
    DocumentoEstrangeiroComponent
  ],
  imports: [
    MatAutocompleteModule,
    SharedModule,
    MatSelectModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    CovalentFileModule,

    
    AgmCoreModule.forRoot({
      apiKey: '	AIzaSyC-lEmBqJyDI3g3_E33AnCGWSGpR1EeTos',
      libraries: ['places']
    }),

    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
  ],
  exports: [
    UsuarioFormComponent,
    UsuarioPessoaFisicaFormComponent,
    UsuarioPessoaJuridicaFormComponent,
    PasswordFormComponent,
    AreasConhecimentoComponent,
    MapsComponent,
    MapComponent,
    AlterarMinhaSenhaComponent,

    SharedModule,

    CommonModule,
    TextMaskModule,
    CovalentFileModule,

    MatSelectModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    AgmCoreModule,
    SugerirAreaConhecimentoComponent,
    NoSubmitDirective,
    DocumentoEstrangeiroComponent
  ],
  entryComponents: [
    AlterarMinhaSenhaComponent,
    SugerirAreaConhecimentoComponent,
    
  ]
})
export class ContaSharedModule {}
