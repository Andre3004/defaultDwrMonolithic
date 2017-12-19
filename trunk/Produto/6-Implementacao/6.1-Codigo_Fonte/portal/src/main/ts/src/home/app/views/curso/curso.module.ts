import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TextMaskModule} from 'angular2-text-mask';
import {CurrencyMaskModule} from 'ng2-currency-mask';
import {CKEditorModule} from 'ng2-ckeditor';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  CovalentDataTableModule,
  CovalentDialogsModule,
  CovalentExpansionPanelModule,
  CovalentFileModule,
  CovalentLayoutModule,
  CovalentMessageModule,
  CovalentPagingModule,
  CovalentStepsModule
} from '@covalent/core';
import {CovalentHighlightModule} from '@covalent/highlight';
import {
  MatButtonToggleModule,
  MatCheckboxModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatStepperModule
} from '@angular/material';
import {ClipboardModule} from 'ngx-clipboard/dist';
import {ShareButtonsModule} from 'ngx-sharebuttons';
import {cursoRouting} from './curso.routing';
import {CursoSharedModule} from './curso-shared.module';
import {ConsultarMatriculasDialogComponent} from "../compra/consultar-matriculas-dialog/consultar-matriculas-dialog.component";

@NgModule({
  declarations: [
  ],
  imports: [
    CursoSharedModule,
    CommonModule,
    cursoRouting,
    CovalentMessageModule,
    TextMaskModule,
    CurrencyMaskModule,
    CKEditorModule,
    FormsModule,
    ReactiveFormsModule,
    CovalentFileModule,
    CovalentExpansionPanelModule,
    CovalentPagingModule,
    CovalentHighlightModule,
    CovalentDialogsModule,
    CovalentDataTableModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonToggleModule,
    CovalentStepsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    ClipboardModule,
    ShareButtonsModule.forRoot(),
    CovalentLayoutModule,
    MatListModule,
    MatStepperModule
  ],
  exports: [
  ],
  entryComponents: [
    ConsultarMatriculasDialogComponent,
  ],
})
export class CursoModule {}
