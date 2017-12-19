import {Component} from "@angular/core";
import {Http, URLSearchParams} from "@angular/http";
import {Broker} from "eits-ngx";
import {MatSnackBar} from "@angular/material";
import 'rxjs/add/operator/toPromise';


/**
 *
 */
@Component( {
    selector: 'app-root',
    templateUrl: './signin-view.component.html',
    styleUrls: ['./signin-view.component.css']
})
export class SigninView
{
  /*-------------------------------------------------------------------
   *                           CONSTRUCTORS
   *-------------------------------------------------------------------*/
  /**
   *
   */
  constructor(public http:Http, public snackBar: MatSnackBar)
  {
  }

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/
  /**
   *
   */
  public usuario:any = {};

  /**
   *
   */
  public messageErroDefault:string = 'Nome de usuário ou senha não conferem';

  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/
  /**
   *
   */
  public onSignIn():void
  {
    const body = new URLSearchParams();
    body.set('email', this.usuario.email);
    body.set('password', this.usuario.password);
    this.login(body)
      .then(result => {
        // Verifica se o usuário existe na base de dados
        Broker.of("usuarioService").promise("findUsuarioByUsername", this.usuario.email)
          .then((result) =>
          {
            // Verifica se o usuário conseguiu se autenticar
            Broker.of("usuarioService").promise("getAuthenticatedUser")
              .then((result) =>
              {
                window.location.replace('/');
              })
              .catch((exception) =>
              {
                console.log(exception);
                this.error(this.messageErroDefault);
              });
          })
          .catch((exception) =>
          {
            this.error(exception.message);
          });
      })
      .catch( exception => {
        console.log(exception);
        this.error(this.messageErroDefault);
      });
  }

  /**
   *
   * @param body
   * @returns {Promise<T>}
   */
  public login(body:any) : Promise<any>
  {
    return this.http.post("authenticate", body).toPromise();
  }

  /**
   *
   * @param message
   */
  public error(message : string)
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
