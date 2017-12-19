import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { TdMediaService } from '@covalent/core';
import { Subscription } from 'rxjs/Subscription';
import {Angulartics2} from "angulartics2";
import {NavigationEnd, Router} from "@angular/router";


@Component({
  selector: 'home-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss']
})
export class DashboardViewComponent implements OnInit, OnDestroy
{

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/
  /**
   *
   * @type {boolean}
   */
  isSmallScreen: boolean = true;
  /**
   *
   */
  public querySubscription: Subscription;

  /**
   * 
   */
  public routerSubscription: Subscription;

  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/
  /**
   *
   * @param {TdMediaService} media
   * @param {NgZone} ngZone
   * @param {Angulartics2} angulartics2
   * @param {Router} router
   */
  constructor(public media: TdMediaService,  public ngZone: NgZone, public angulartics2: Angulartics2, public router: Router)
  {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.angulartics2.eventTrack.next({ action: 'navegacao para ' + event.urlAfterRedirects, properties: { category: 'navegacao' }});
      }
    });
  }


  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/
  /**
   *
   */
  ngOnInit()
  {
    this.checkScreen();
  }

  checkScreen(): void {
    this.ngZone.run(() => {
      this.isSmallScreen = this.media.query('gt-sm');
    });
    this.watchScreen();
  }

  /**
   * Observa o tamanho da tela para especificar diferentes comportamentos
   */
  watchScreen(): void {
    this.querySubscription = this.media.registerQuery('gt-sm').subscribe((matches: boolean) => {
       this.ngZone.run(() => {
        this.isSmallScreen = matches;
      });
    });
  }

  /**
   *
   */
  ngOnDestroy(): void {
    if(this.querySubscription) this.querySubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }
}
