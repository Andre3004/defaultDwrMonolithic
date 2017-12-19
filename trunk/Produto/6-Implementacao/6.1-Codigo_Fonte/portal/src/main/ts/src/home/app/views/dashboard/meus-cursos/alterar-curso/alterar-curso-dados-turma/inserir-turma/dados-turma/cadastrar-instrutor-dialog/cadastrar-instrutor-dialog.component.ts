import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from "@angular/material";
import { Broker } from "eits-ngx";
import { textMasks } from "../../../../../../../../controls/text-masks/text-masks";

@Component({
  selector: 'cadastrar-instrutor-dialog',
  templateUrl: './cadastrar-instrutor-dialog.component.html',
  styleUrls: ['./cadastrar-instrutor-dialog.component.css']
})
export class CadastrarInstrutorDialogComponent implements OnInit
{
  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/

  /**
   *
   */
  instrutor: any = {};

  masks = textMasks;

  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/
  /**
   *
   * @param dialogRef
   */
  constructor(public dialogRef: MatDialogRef<CadastrarInstrutorDialogComponent>, public snackBar: MatSnackBar) { }
  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/
  /**
   *
   */
  ngOnInit()
  {
  }

  /**
   *
   */
  public closeDialog()
  {
    this.dialogRef.close();
  }

  /**
   *
   * @param event
   */
  public inserirInstrutor(event: Event)
  {
    event.preventDefault();
    Broker.of("usuarioService").promise("insertInstrutor", this.instrutor)
      .then((result) =>
      {
        if (result)
        {
          this.dialogRef.close(result);
        }
      })
      .catch((exception)=>
      {
        this.openSnackBar(exception.message);
      })
  }

    /**
   *
   * @param message
   */
  public openSnackBar(message: string)
  {
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }

  /**
   *
   */
  public emailChanged()
  {
    if (this.instrutor.email === "")
      {
        this.instrutor.email = null;
      }
  }
}
