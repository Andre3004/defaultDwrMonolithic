import {Component, OnDestroy} from "@angular/core";
import {Http, URLSearchParams} from "@angular/http";
import {Broker} from "eits-ngx";
import {MatSnackBar} from "@angular/material";
import 'rxjs/add/operator/toPromise';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticatedUserService} from "../../../../controls/authenticated-user/authenticated-user.service";
import {Subscription} from "rxjs/Subscription";
import {window} from "rxjs/operator/window";


/**
 *
 */
@Component( {
    selector: 'redefinir-senha',
    templateUrl: './redefinir-senha.component.html',
    styleUrls: ['./redefinir-senha.component.css']
})
export class RedefinirSenhaComponent implements OnDestroy
{


  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  public usuario:any = {};

  /**
   *
   * @type {any}
   */
  public newPassword: string = null;

  /**
   *
   * @type {any}
   */
  public newPasswordConfirm: string = null;

  /**
   *
   * @type {string}
   */
  public login: string = null;

  /**
   *
   */
  public subscription: Subscription;
  /*-------------------------------------------------------------------
   *                           CONSTRUCTORS
   *-------------------------------------------------------------------*/
  /**
   *
   */
  constructor(public activatedRoute: ActivatedRoute, public router: Router, public authenticatedUserService: AuthenticatedUserService, public http:Http, public snackBar: MatSnackBar)
  {
    this.subscription = authenticatedUserService.authenticatedUserChanged.subscribe((user) =>
    {
      if (user.id)
      {
        this.usuario = user;
        this.toMyAccount();
      }
    });
  }

  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/
  /**
   *
   */
  toMyAccount()
  {
    if (this.usuario.isAdministrador)
    {
      this.router.navigate(['dashboard/cursos']);
    }
    else if (this.usuario.isInstrutor)
    {
      this.router.navigate(['dashboard/meus-cursos']);
    }
    else
    {
      this.router.navigate(['dashboard/minhas-compras']);
    }
  }

  /**
   *
   */
  ngOnDestroy()
  {
    if (this.subscription)
    {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Função que realiza a recuperação da senha e login
   * @param newPassword
   * @param newPasswordConfirm
   */
  public redefinirSenha(newPassword, newPasswordConfirm)
  {
    Broker.of("usuarioService").promise("redefinirSenha", newPassword, newPasswordConfirm, this.activatedRoute.snapshot.params['token'])
      .then((result) =>
      {
        if (result.id)
        {
          this.success();
        }
      })
      .catch((exception) =>
      {
        this.error(exception.message);
      });
  }

  /**
   *
   */
  public success()
  {
    // Se já está autenticado, vai par ao minha conta
    Broker.of("usuarioService").promise("getAuthenticatedUser")
      .then((result) =>
      {
        if (result)
        {
          this.authenticatedUserService.setAuthenticatedUser(result);

          Broker.of("usuarioService").promise("findUsuarioFotoByUsuarioId", result.id)
            .then((result) =>
            {
              this.authenticatedUserService.setFotoUserAuthenticated(result);
            });

          this.toMyAccount();
        }
      }).catch(exception =>
    {
      this.error(exception.message);
    });
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
