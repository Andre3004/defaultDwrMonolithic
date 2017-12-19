import { Md2DatepickerModule, MdNativeDateModule } from 'md2';
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
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

import {AuthenticationRoutingModule} from "./authentication-routing.module";
import {SigninView} from "./views/signin/signin-view.component";
import 'hammerjs';
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
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CovalentMarkdownModule} from "@covalent/markdown";
import {CovalentHighlightModule} from "@covalent/highlight";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../home/app/shared.module";

/**
 *
 */
@NgModule( {
    declarations: [
        SigninView,
    ],
    imports: [
        CovalentLayoutModule,
        CommonModule,
        FormsModule,
        HttpModule,
        AuthenticationRoutingModule,
        MatIconModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatCheckboxModule,
        MatInputModule,
        MatRadioModule,
        MatSidenavModule,
        MatDialogModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatListModule,
        MatButtonToggleModule,
        CommonModule,
        CovalentStepsModule,
        FormsModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        CovalentLayoutModule,
        CovalentChipsModule,
        CovalentFileModule,
        CovalentExpansionPanelModule,
        CovalentPagingModule,
        CovalentLoadingModule,
        CovalentMediaModule,
        CovalentMessageModule,
        CovalentCommonModule,
        CovalentMarkdownModule,
        CovalentHighlightModule,
        CovalentDialogsModule,
        CovalentDataTableModule,
        MatIconModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatCheckboxModule,
        MatInputModule,
        MatRadioModule,
        MatSidenavModule,
        MatDialogModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatListModule,
        MatButtonToggleModule,
        CommonModule,
        CovalentStepsModule,
        FormsModule,
        Md2DatepickerModule,
        MdNativeDateModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        SharedModule
    ],
    providers: [],
    bootstrap: [SigninView]
})
export class AuthenticationModule
{
    /*-------------------------------------------------------------------
     *                           ATTRIBUTES
     *-------------------------------------------------------------------*/
}
