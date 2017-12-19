import { state } from '@angular/animations';
import { RealizarLoginComponent } from './../../views/aluno/realizar-login/realizar-login.component';
import { AuthenticatedUserService } from './../authenticated-user/authenticated-user.service';
import { Injectable, OnInit } from '@angular/core';
import
{
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  Route
} from '@angular/router';
import { Broker } from "eits-ngx";
import 'rxjs/add/observable/fromPromise';
import { Observable } from "rxjs/Observable";
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router/src/router_state';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild
{
  /**
   *
   */
  subscription: any;
  /**
   *
   * @type {boolean}
   */
  canActivateVar: boolean = false;

  /**
   *
   */
  constructor(private authenticatedUserService: AuthenticatedUserService, private dialog: MatDialog, private router: Router)
  {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean>
  {
    return this.checkUrlAndLogin(route, state.url);
  }

  /**
   * 
   * @param childRoute 
   * @param state 
   */
  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean>
  {
    return this.canActivate(childRoute, state);
  }

  /**
   * 
   */
  private checkUrlAndLogin(route: ActivatedRouteSnapshot, redirectUrl: string)
  {
    if (this.authenticatedUserService.getAuthenticatedUser())
    {
      return true;
    }
    else if (route.data && route.data.redirectToPublic)
    {
      this.redirectToVisualizarCursoPublic(route);
    }
    else
    {
      this.dialog.open(RealizarLoginComponent, { data: { redirectUrl: redirectUrl } }).afterClosed().subscribe(
        (result) =>
        {
          if (!result) //if login canceled
          {
            this.router.navigate([""]); //default page
          }
        }
      );
      return false;
    }
  }

  private redirectToVisualizarCursoPublic(route: ActivatedRouteSnapshot)
  {
    let cursoId = route.params['id'];

    if(cursoId)
    {
      this.router.navigate(["cursos", cursoId]);
    }
  }
}
