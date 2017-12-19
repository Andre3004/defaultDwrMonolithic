import { RealizarLoginComponent } from './../../views/aluno/realizar-login/realizar-login.component';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { Broker } from 'eits-ngx';
import { Injectable, EventEmitter } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

@Injectable()
export class AuthenticatedUserService
{

  /*-------------------------------------------------------------------
  *                           ATTRIBUTES
  *-------------------------------------------------------------------*/

  /**
   *
   */
  public subscription: any;

  /**
   *
   */
  public authenticatedUser: any = null;

  /**
   *
   */
  public authenticatedUserFoto: any = null;

  /**
   *
   */
  public authenticatedUserChanged: EventEmitter<any>;


  /*-------------------------------------------------------------------
  *                           CONSTRUCTOR
  *-------------------------------------------------------------------*/

  /**
   *
   */
  constructor()
  {

    this.authenticatedUserChanged = new EventEmitter();

    //Pega o usuário logado
    this.authenticatedUser = this.getObservedAuthenticatedUser();

    this.getPromiseAuthenticatedUser()
      .then((result) =>
      {

        let userAuthenticated = result;
        this.findUsuarioFotoByUsuarioId(result.id)
          .then((result) =>
          {

            this.setFotoUserAuthenticated(result);
            this.setAuthenticatedUser(userAuthenticated);

          }).catch((exception) =>
          {
            this.setAuthenticatedUser(userAuthenticated);
          });
      }).catch((exception) =>
      {
      });
  }

  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/

  /**
   *
   * @returns {any}
   */
  public getPromiseAuthenticatedUser(): Promise<any>
  {
    if (this.authenticatedUser)
    {
      return Promise.resolve(Object.assign({}, this.getAuthenticatedUser()));
    }
    else
    {
      return Promise.resolve(Broker.of("usuarioService").promise("getAuthenticatedUser"));
    }
  }

  /**
   *
   * @returns {any}
   */
  public getPromiseAuthenticatedUserFoto(): Promise<any>
  {
    return this.findUsuarioFotoByUsuarioId(this.authenticatedUser.id);
  }

  /**
   *
   */
  public getAuthenticatedUser(): any
  {
    return this.authenticatedUser;
  }

  /**
   *
   * @returns {any}
   */
  public getObservedAuthenticatedUser(): any
  {
    //Pega o usuário logado
    this.subscription = Observable.fromPromise(Broker.of("usuarioService").promise("getAuthenticatedUser")
      .then(result =>
      {
        this.authenticatedUser = result;
        return this.authenticatedUser;
      }));

    this.subscription
      .subscribe(result =>
      {
        this.authenticatedUser = result;
      });


    if (this.authenticatedUser && !this.authenticatedUser.foto)
    {
      //Pega a foto do usuário logado
      let subscriptionFoto = Observable.fromPromise(Broker.of("usuarioService").promise("findUsuarioFotoByUsuarioId", this.authenticatedUser.id)
        .then(result =>
        {
          this.authenticatedUser.foto = result;
          return this.authenticatedUser.foto;
        }));

      subscriptionFoto
        .subscribe(result =>
        {
          this.authenticatedUser.foto = result;
        });
    }

    return this.authenticatedUser;
  }

  /**
   *
   * @param authenticatedUser
   */
  public setAuthenticatedUser(authenticatedUser: any)
  {
    this.authenticatedUser = authenticatedUser;

    this.authenticatedUserChanged.emit(this.getAuthenticatedUser());
  }

  /**
   *
   * @param foto
   */
  public setFotoUserAuthenticated(foto: any)
  {
    this.authenticatedUserFoto = foto;
  }


  /**
   * TODO Mudar para observer
   * @param authendicatedUserId
   */
  public findUsuarioFotoByUsuarioId(authendicatedUserId)
  {
    return Promise.resolve(Broker.of("usuarioService").promise("findUsuarioFotoByUsuarioId", authendicatedUserId));
  }

}
