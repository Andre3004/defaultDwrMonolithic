import { Component, Inject } from "@angular/core";
import { Http, URLSearchParams } from "@angular/http";
import { Broker } from "eits-ngx";
import { MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import 'rxjs/add/operator/toPromise';
import { MatDialogRef } from "@angular/material";
import { AuthenticatedUserService } from "../../../controls/authenticated-user/authenticated-user.service";
import { Router } from "@angular/router";


/**
 *
 */
@Component({
  selector: 'realizar-login',
  templateUrl: './realizar-login.component.html',
  styleUrls: ['./realizar-login.component.css']
})
export class RealizarLoginComponent
{


  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/
  /**
   *
   */
  public usuario: any = {};

  /**
   *
   */
  public messageErroDefault: string = 'Nome de usuário ou senha não conferem';

  /*-------------------------------------------------------------------
   *                           CONSTRUCTORS
   *-------------------------------------------------------------------*/
  /**
   *
   */
  constructor(public router: Router, public dialogRef: MatDialogRef<RealizarLoginComponent>, public http: Http, public snackBar: MatSnackBar, public authenticatedUserService: AuthenticatedUserService, @Inject(MAT_DIALOG_DATA) public data: any)
  {
  }

  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/

  /**
   *
   */
  public goToRecuperarSenha()
  {
    this.dialogRef.close(false);
    this.router.navigate(['conta/recuperar-acesso']);
  }

  /**
   *
   */
  public onSignIn(): void
  {
    this.login()
      .then(result =>
      {
        // Verifica se o usuário existe na base de dados
        Broker.of("usuarioService").promise("findUsuarioByUsername", this.usuario.email)
          .then((result) =>
          {
            this.authenticatedUserService.setAuthenticatedUser(result);
            this.redirect();
            this.dialogRef.close(result);
          })
          .catch((exception) =>
          {
            this.error(exception.message);
          });
      })
      .catch(exception =>
      {
        console.log(exception);
        let bodyResponse = JSON.parse(exception._body);

        this.error((bodyResponse.message) ? bodyResponse.message : this.messageErroDefault);
      });
  }

  /**
   * 
   */
  public redirect()
  {
    if (this.data && this.data.redirectUrl)
    {
      this.router.navigate([this.data.redirectUrl]);
    }
  }

  /**
   *
   * @param body
   * @returns {Promise<T>}
   */
  public login(): Promise<any>
  {
    const body = new URLSearchParams();
    body.set('email', this.usuario.email);
    body.set('password', this.usuario.password);

    return this.http.post("authenticate", body).toPromise();
  }

  /**
   *
   * @param message
   */
  public error(message: string)
  {
    this.openSnackBar(message);
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

}
