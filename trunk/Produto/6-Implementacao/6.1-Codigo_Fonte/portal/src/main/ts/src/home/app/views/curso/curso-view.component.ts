import { Component, OnDestroy } from "@angular/core";
import {NavigationEnd, Router} from "@angular/router";
import {Angulartics2} from "angulartics2";
import { Subscription } from "rxjs/Subscription";

/**
 *
 */
@Component( {
    selector: 'curso-view',
    templateUrl: './curso-view.component.html',
    styleUrls: ['./curso-view.component.scss']
})
export class CursoViewComponent implements OnDestroy
{
  /**
   * 
   */
  private routerSubscription: Subscription;

  /**
   *
   * @param {Angulartics2GoogleAnalytics} angulartics2GoogleAnalytics
   * @param {Router} router
   */
  constructor(public angulartics2: Angulartics2, public router: Router)
  {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.angulartics2.eventTrack.next({ action: 'navegacao para ' + event.urlAfterRedirects, properties: { category: 'navegacao' }});
      }
    });
  }

  /**
   * 
   */
  ngOnDestroy()
  {
    if(this.routerSubscription) this.routerSubscription.unsubscribe();
  }
}
