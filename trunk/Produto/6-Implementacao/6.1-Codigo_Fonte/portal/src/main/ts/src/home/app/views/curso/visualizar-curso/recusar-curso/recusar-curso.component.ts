import {Component} from "@angular/core";
import {MatDialogRef} from "@angular/material";
import "rxjs/add/operator/switchMap";

@Component({
  selector: 'recusar-curso',
  templateUrl: './recusar-curso.component.html',
  styleUrls: ['./recusar-curso.component.css']
})

export class RecusarCursoComponent
{

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/
  /**
   *
   */
  justificativa: String;

  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/

  /**
   *
   * @param dialogRef
   */
  constructor(public dialogRef: MatDialogRef<RecusarCursoComponent>)
  {

  }

  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/

}
