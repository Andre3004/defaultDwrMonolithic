import { Md2DatepickerModule, MdNativeDateModule } from 'md2';
import {NgModule} from '@angular/core';

import {LoggedMenuComponent} from "./controls/logged-menu/logged-menu.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CovalentChipsModule, CovalentCommonModule, CovalentMediaModule, CovalentMessageModule} from "@covalent/core";
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatTooltipModule
} from "@angular/material";
import {CovalentMarkdownModule} from "@covalent/markdown";
import {CursoCardComponent} from "./views/curso/consultar-cursos-aprovados/curso-card/curso-card.component";
import {AvatarComponent} from "./controls/avatar/avatar.component";
import {TermosUsoDialogComponent} from "./controls/termos-uso/termos-uso-dialog/termos-uso-dialog.component";
import {TermosUsoComponent} from "./controls/termos-uso/termos-uso.component";
import {CopyrightFooterComponent} from "./controls/copyright-footer/copyright-footer.component";
import {CommonModule} from "@angular/common";
import {RatingComponent} from "./controls/rating/rating.component";
import {RouterModule} from "@angular/router";
import {HighlightDirective} from "./controls/highlight/highlight.directive";
import {ClickWithoutMoveDirective} from "./controls/click-without-move/click-without-move.directive";
import {ConfirmDialogComponent} from "./controls/confirm-dialog/confirm-dialog.component";
import {HomeContainerComponent} from './controls/home-container/home-container.component';
import { StopPropagationDirective } from './controls/stop-propagation/stop-propagation.directive';

@NgModule({
  declarations: [
    TermosUsoComponent,
    TermosUsoDialogComponent,
    CopyrightFooterComponent,
    RatingComponent,
    CursoCardComponent,
    LoggedMenuComponent,
    AvatarComponent,
    ConfirmDialogComponent,
    HomeContainerComponent,
    HighlightDirective, //TODO colocar no módulo exclusívo
    ClickWithoutMoveDirective, //TODO colocar no módulo exclusívo
    StopPropagationDirective,
  ],
  imports : [
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
    MatCheckboxModule,
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
  ],
  exports: [
    MatCheckboxModule,
    CommonModule,
    RatingComponent,
    LoggedMenuComponent,
    CursoCardComponent,
    AvatarComponent,
    TermosUsoComponent,
    TermosUsoDialogComponent,
    CopyrightFooterComponent,
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
    FormsModule,
    Md2DatepickerModule,
    MdNativeDateModule,
    MatSnackBarModule, // Utilizado pelas dialog's
    RouterModule,
    ReactiveFormsModule,
    ConfirmDialogComponent,
    HomeContainerComponent,
    HighlightDirective,
    ClickWithoutMoveDirective,
    StopPropagationDirective
  ], entryComponents: [
    ConfirmDialogComponent,
    TermosUsoDialogComponent
  ],
})
export class SharedModule{}
