import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { Broker } from "eits-ngx";

@Component({
  selector: 'termos-uso-dialog',
  templateUrl: './termos-uso-dialog.component.html',
  styleUrls: ['./termos-uso-dialog.component.css']
})
export class TermosUsoDialogComponent implements OnInit
{
  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/
  /**
   *
   */
  public termosUso: string;

  /*-------------------------------------------------------------------
   *                           CONSTRUCTORS
   *-------------------------------------------------------------------*/
  /**
   *
   * @param {MatDialogRef<TermosUsoDialogComponent>} dialogRef
   */
  constructor(public dialogRef: MatDialogRef<TermosUsoDialogComponent>,  @Inject(MAT_DIALOG_DATA) public data: any)
  {
  }
  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/
  /**
   *
   */
  ngOnInit()
  {
    this.getTermosUso();
  }

  /**
   *
   */
  public getTermosUso()
  {
    Broker.of("configuracaoService").promise("getTermosUso")
      .then((result) =>
      {
        if(result)
        {
          this.termosUso = result;
        }
      });
  }

  /**
   *
   * @param {boolean} accepted
   */
  public closeDialog(accepted: boolean)
  {
    this.dialogRef.close(accepted);
  }
}
