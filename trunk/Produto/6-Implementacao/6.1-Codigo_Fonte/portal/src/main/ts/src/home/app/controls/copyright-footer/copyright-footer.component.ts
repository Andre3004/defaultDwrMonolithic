import {Component} from "@angular/core";
import {TermosUsoDialogComponent} from "../termos-uso/termos-uso-dialog/termos-uso-dialog.component";
import {MatDialog} from "@angular/material";
import { SugerirCursoComponent } from "../../views/curso/sugerir-curso/sugerir-curso.component";

@Component({
  selector: 'copyright-footer',
  templateUrl: './copyright-footer.component.html',
  styleUrls: ['./copyright-footer.component.scss']
})
export class CopyrightFooterComponent
{
  /*-------------------------------------------------------------------
  *                           ATTRIBUTES
  *-------------------------------------------------------------------*/

  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/
  /**
   *
   */
  constructor(public dialog: MatDialog)
  {
  }

  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/

  /**
   *
   */
  public openTermosUsoDialog()
  {
    let dialogRef = this.dialog.open(TermosUsoDialogComponent,{data: {
      hideConcordo: true
    }});
  }

  public sugerirCurso()
  {
    this.dialog.open(SugerirCursoComponent);
  }

}
