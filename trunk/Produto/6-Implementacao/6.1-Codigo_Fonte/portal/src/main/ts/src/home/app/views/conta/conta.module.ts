import {NgModule} from '@angular/core';
import {contaRouting} from "./conta.routing";
import {ContaSharedModule} from "./conta-shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {
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
  MatTooltipModule
} from "@angular/material";
import {CovalentMarkdownModule} from "@covalent/markdown";
import {
  CovalentChipsModule,
  CovalentCommonModule,
  CovalentDataTableModule,
  CovalentDialogsModule,
  CovalentExpansionPanelModule,
  CovalentFileModule,
  CovalentLayoutModule,
  CovalentLoadingModule,
  CovalentMediaModule,
  CovalentMessageModule,
  CovalentPagingModule,
  CovalentStepsModule
} from "@covalent/core";
import {ClipboardModule} from "ngx-clipboard/dist";
import {CovalentHighlightModule} from "@covalent/highlight";
import {CommonModule} from "@angular/common";
import {RecuperarSenhaComponent} from "./recuperar-acesso/recuperar-senha/recuperar-senha.component";
import {RecuperarAcessoViewComponent} from "./recuperar-acesso/recuperar-acesso-view.component";
import { Md2DatepickerModule, MdNativeDateModule } from 'md2';

@NgModule({
  declarations: [
  ],
  imports: [

    ReactiveFormsModule,
    contaRouting,
    ContaSharedModule,
    CommonModule,
    CovalentChipsModule,
    CovalentMediaModule,
    CovalentMessageModule,
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
    FormsModule,
    Md2DatepickerModule,
    MdNativeDateModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    RouterModule,

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
  ],
  exports: [
  ],
  entryComponents: [
  ],
})
export class ContaModule {}
