import { MatSnackBar } from '@angular/material';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { Broker } from "eits-ngx";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'alterar-curso-view',
  templateUrl: './alterar-curso-view.component.html',
  styleUrls: ['./alterar-curso-view.component.css']
})
export class AlterarCursoComponentView implements OnInit, OnDestroy
{

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  public curso: any;

  /**
   *
   */
  public routerListener: Subscription;

  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/

  /**
   *
   * @param snackBar
   * @param activatedRoute
   * @param router
   */
  constructor(public snackBar: MatSnackBar, public activatedRoute: ActivatedRoute, public router: Router)
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
    this.findCursoById();

    this.routerListener = this.router.events.filter(event => event instanceof NavigationStart).subscribe(() =>
    {
      this.findCursoById();
    });
  }

  /**
   *
   */
  ngOnDestroy()
  {
    if (this.routerListener) this.routerListener.unsubscribe();
  }

  /**
   *
   */
  public findCursoById()
  {
    Broker.of("cursoService").promise("findCursoById", this.activatedRoute.snapshot.params['id'])
      .then((result) =>
      {
        this.curso = result;
      })
      .catch((exception) =>
      {
      });
  }

  /**
   *
   */
  public isCursoPendente(): boolean
  {
    if (this.curso)
    {
      return this.curso.statusCurso == 'PENDENTE'
    }
    return false;
  }
}
