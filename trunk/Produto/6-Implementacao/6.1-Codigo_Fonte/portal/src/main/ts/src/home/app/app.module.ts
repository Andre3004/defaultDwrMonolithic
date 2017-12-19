import { DateLocale } from 'md2';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { LOCALE_ID, NgModule } from '@angular/core';
import { CursoViewComponent } from './views/curso/curso-view.component';
import { ConsultarCursosAprovadosComponent } from './views/curso/consultar-cursos-aprovados/consultar-cursos-aprovados.component';
import { HeaderComponent } from './controls/header/header.component';
import { PageFooterComponent } from './views/curso/consultar-cursos-aprovados/page-footer/page-footer.component';
import { AppComponent } from './app.component';
import { SugerirCursoComponent } from './views/curso/sugerir-curso/sugerir-curso.component';
import { AnonymousMenuComponent } from './controls/anonymous-menu/anonymous-menu.component';
import { AuthenticatedUserService } from './controls/authenticated-user/authenticated-user.service';
import { AuthGuard } from './controls/auth/auth-guard.service';
import { RealizarLoginComponent } from './views/aluno/realizar-login/realizar-login.component';
import { DateAdapter, NativeDateAdapter, MatSliderModule } from '@angular/material';
import { AppRoutingModule } from "./app-routing.module";
import { SharedModule } from "./shared.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpModule } from "@angular/http";
import { ToastyModule } from "ng2-toasty";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { CovalentLoadingModule } from "@covalent/core";
import { TermosUsoViewComponent } from "./views/curso/termos-uso/termos-uso.component";
import { SobreViewComponent } from './views/sobre/sobre-view.component';

/**
 *
 */
@NgModule({
  declarations: [
    AppComponent,
    CursoViewComponent,
    ConsultarCursosAprovadosComponent,
    HeaderComponent,
    PageFooterComponent,

    SugerirCursoComponent,
    AnonymousMenuComponent,
    RealizarLoginComponent,
    SobreViewComponent,
    TermosUsoViewComponent,

  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    MatSliderModule,
    AppRoutingModule,
    CommonModule,
    SharedModule,
    HttpModule, // ultilizado no login
    ToastyModule.forRoot(),
    ReactiveFormsModule,
    CovalentLoadingModule,
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
  ],
  exports: [],
  entryComponents: [
    RealizarLoginComponent,
    SugerirCursoComponent,
  ],
  providers: [
    AuthenticatedUserService,
   { provide: LOCALE_ID, useValue: "pt-BR" },
  ],
  bootstrap: [AppComponent]
})
export class AppModule
{
  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

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
