import { Location } from '@angular/common';
import { AuthenticatedUserService } from './../authenticated-user/authenticated-user.service';
import { Component, OnDestroy } from "@angular/core";
import { Broker } from "eits-ngx";
import "rxjs/add/operator/switchMap";
import { MatDialog, MatSnackBar } from "@angular/material";
import { RealizarLoginComponent } from "../../views/aluno/realizar-login/realizar-login.component";
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router, ActivatedRoute } from "@angular/router";
import { LoadingMode, LoadingType, TdLoadingService } from "@covalent/core";
import { Subscription } from 'rxjs/Subscription';
import { SugerirCursoComponent } from '../../views/curso/sugerir-curso/sugerir-curso.component';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('flyIn', [
      state('in', style({ transform: 'scale(1)' })),
      transition(':enter', [
        style({ transform: 'scale(0)' }),
        animate("100ms 1s ease-out")
      ])
    ])
  ]
})
export class HeaderComponent implements OnDestroy
{
  /*-------------------------------------------------------------------
  *                           ATTRIBUTES
  *-------------------------------------------------------------------*/

  /**
   *
   */
  public aluno: any;

  /**
   * 
   */
  public userSubscription: Subscription;

  /**
   * 
   */
  public routerSubscription: Subscription;

  /*-------------------------------------------------------------------
  *                           CONSTRUCTOR
  *-------------------------------------------------------------------*/
  /**
   *
   * @param snackBar
   * @param dialog
   */
  constructor(public snackBar: MatSnackBar, public dialog: MatDialog, public authenticatedUserService: AuthenticatedUserService, public router: Router, public location: Location, public loadingService: TdLoadingService)
  {
    this.loadingService.create({
      name: 'loadingLogin',
      mode: LoadingMode.Indeterminate,
      type: LoadingType.Circular,
      color: 'accent',
    });

    this.routerSubscription = router.events.subscribe(event => {
      if(event instanceof RouteConfigLoadStart) {
        this.loadingService.register("loadingLogin");
      }
      if(event instanceof RouteConfigLoadEnd) {
        this.loadingService.resolve("loadingLogin");
      }
    });

    this.userSubscription = authenticatedUserService.authenticatedUserChanged.subscribe(
      (user) =>
      {
        this.aluno = user;

        authenticatedUserService.getPromiseAuthenticatedUserFoto().then((authenticatedUserFoto) =>
        {
          if (authenticatedUserFoto)
          {
            this.aluno.foto = authenticatedUserFoto;
          }
        })
          .catch((exception) =>
          {
          })

      });
  }

  /*-------------------------------------------------------------------
  *                           BEHAVIORS
  *-------------------------------------------------------------------*/

  ngOnDestroy(): void
  {
    if (this.userSubscription) this.userSubscription.unsubscribe();
    if(this.routerSubscription) this.routerSubscription.unsubscribe();
  }
  /**
   *
   */
  public login(): void
  {
    let dialogRef = this.dialog.open(RealizarLoginComponent);

    dialogRef.afterClosed().subscribe(result =>
    {
      if (result)
      {
        this.aluno = this.authenticatedUserService.getObservedAuthenticatedUser();
      }
    });
  }

  /**
   *
   */
  public logout(): void
  {
    window.location.replace('/logout');
  }

  /**
   *
   */
  ngOnInit()
  {
    this.ngAfterViewInit();
    this.getAuthenticatedUser();
  }

  /**
   *
   */
  ngAfterViewInit(): void
  {
    // broadcast to all listener observables when loading the page
    // this.media.broadcast();
  }

  /**
   *
   */
  toMyAccount()
  {
    if (this.aluno.isAdministrador)
    {
      this.router.navigate(['dashboard/cursos']);
    }
    else if (this.aluno.isInstrutor)
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
  public getAuthenticatedUser(): void
  {
    this.authenticatedUserService.getPromiseAuthenticatedUser()
      .then((authenticatedUser) =>
      {
        if (authenticatedUser)
        {
          this.aluno = authenticatedUser;
          this.findUsuarioFotoByUsuarioId(authenticatedUser.id);
        }
      })
      .catch((exception) =>
      {
      })
  }

  /**
  *
  * @param alunoId
  */
  public findUsuarioFotoByUsuarioId(alunoId: number)
  {
    Broker.of("usuarioService").promise("findUsuarioFotoByUsuarioId", alunoId)
      .then((result) =>
      {
        this.aluno.foto = result;
        this.authenticatedUserService.setFotoUserAuthenticated(result);
      })
      .catch((exception) =>
      {
      });
  }

  public sugerirCurso()
  {
    this.dialog.open(SugerirCursoComponent);
  }
}
