import {NgModule} from "@angular/core";

import {PublicRoutingModule} from "./public-routing.module";
import {CodigoIncorporacaoView} from "./views/codigo-incorporacao/codigo-incorporacao-view.component";
import {PublicComponent} from './public.component';
import {SharedModule} from "../../home/app/shared.module";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CursoSharedModule} from "../../home/app/views/curso/curso-shared.module";
import {ContaSharedModule} from "../../home/app/views/conta/conta-shared.module";

/**
 *
 */
@NgModule({
    declarations: [
      CodigoIncorporacaoView,
      PublicComponent,
    ],
    imports: [
      ContaSharedModule,
      PublicRoutingModule,
      BrowserAnimationsModule,
      BrowserModule,
      CommonModule,
    ],
  exports: [
      ContaSharedModule,
      PublicRoutingModule,
      CodigoIncorporacaoView,
      PublicComponent,
    ],
    providers: [],
    bootstrap: [PublicComponent]
})
export class PublicModule
{
    /*-------------------------------------------------------------------
     *                           ATTRIBUTES
     *-------------------------------------------------------------------*/
}
