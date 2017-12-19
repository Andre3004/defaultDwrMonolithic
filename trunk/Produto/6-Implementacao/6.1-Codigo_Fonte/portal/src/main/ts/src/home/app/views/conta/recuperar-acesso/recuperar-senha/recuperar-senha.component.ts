import {Component, OnDestroy} from "@angular/core";
import {Http} from "@angular/http";
import {Broker} from "eits-ngx";
import {MatSnackBar} from "@angular/material";
import 'rxjs/add/operator/toPromise';
import {Router} from "@angular/router";
import {AuthenticatedUserService} from "../../../../controls/authenticated-user/authenticated-user.service";
import {Subscription} from "rxjs/Subscription";


/**
 *
 */
@Component( {
    selector: 'recuperar-senha',
    templateUrl: './recuperar-senha.component.html',
    styleUrls: ['./recuperar-senha.component.css']
})
export class RecuperarSenhaComponent implements OnDestroy
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
   * @type {string}
   */
  public login: string = null;

  /**
   *
   */
  private userSubscription: Subscription;

  /*-------------------------------------------------------------------
  *                           CONSTRUCTORS
  *-------------------------------------------------------------------*/
  /**
   *
   */
  constructor(public router: Router, public authenticatedUserService: AuthenticatedUserService, public http:Http, public snackBar: MatSnackBar)
  {
    this.userSubscription = authenticatedUserService.authenticatedUserChanged.subscribe((user) =>
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
   * Função que realiza a recuperação de senha
   * @param login
   */
  public recuperarSenha(login)
  {
    Broker.of("usuarioService").promise("recuperarSenha", login)
    .then((result) =>
    {
      if (!result.lastLogin)
      {
        this.openSnackBar("Complete seu cadastro");
        if (result.isInstrutor)
        {
          this.router.navigate(['conta/completar-cadastro/instrutor/' + result.id]);
        }
        else if (result.isAluno)
        {
          this.router.navigate(['conta/completar-cadastro/aluno/' + result.id]);
        }
      }
      else
      {
        this.openSnackBar("Sua senha foi enviada para o e-mail: " + result.email)
      }
    })
    .catch((exception) =>
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

  /**
   *
   */
  ngOnDestroy(): void
  {
    if(this.userSubscription) this.userSubscription.unsubscribe();
  }
}
