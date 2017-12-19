import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Broker } from 'eits-ngx';

@Component({
  selector: 'alterar-minha-senha',
  templateUrl: './alterar-minha-senha.component.html',
  styleUrls: ['./alterar-minha-senha.component.css']
})
export class AlterarMinhaSenhaComponent implements OnInit
{

  /*-------------------------------------------------------------------
  *                           ATTRIBUTES
  *-------------------------------------------------------------------*/

  /**
   *
   */
  currentPassword: string;

  /**
   *
   */
  newPassword: string;

  /**
   *
   */
  newPasswordConfirm: string;

  /**
   *
   */
  aluno: any;

  /*-------------------------------------------------------------------
   *                           CONSTRUCTORS
   *-------------------------------------------------------------------*/

  /**
   *
   * @param data
   */
  constructor( @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AlterarMinhaSenhaComponent>, public snackBar: MatSnackBar)
  {
    this.aluno = data;
  }


  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/
  ngOnInit()
  {
  }

  /**
   *
   * @param event
   */
  public alterarMinhaSenha( event: Event ): void
  {
    event.preventDefault();
    Broker.of("usuarioService").promise("updateUsuarioChangingPassword", this.aluno.id, this.currentPassword, this.newPassword)
      .then(result =>
      {
        if (result)
        {
          this.dialogRef.close();
          this.openSnackBar("Senha alterada com sucesso");
        }
      })
      .catch(exception =>
      {
        this.openSnackBar(exception.message);
      })
  }

  /**
   *
   * @param message
   */
  openSnackBar(message: string)
  {
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }
}
