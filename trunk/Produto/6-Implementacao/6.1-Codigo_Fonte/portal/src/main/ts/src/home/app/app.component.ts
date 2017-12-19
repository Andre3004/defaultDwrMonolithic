/**
 * Created by Emanuel Victor on 17/04/2017.
 */
import { Component, ViewChild, OnInit, Renderer } from "@angular/core";
import {NavigationEnd, NavigationStart, Router} from "@angular/router";
import {Angulartics2} from "angulartics2";
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit
{
  /**
   * Usado para fazer scroll até o topo da página
   */
  @ViewChild('top')
  topElement: any;

  /**
   *
   */
  currentUrl: any;

  /**
   *
   * @param {Angulartics2GoogleAnalytics} angulartics2GoogleAnalytics
   * @param {Router} router
   */
  constructor(public angulartics2: Angulartics2, public router: Router, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics)
  {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.angulartics2.eventTrack.next({ action: 'navegacao para ' + event.urlAfterRedirects, properties: { category: 'navegacao' }});
      }
    });
  }

  /**
   *
   */
  ngOnInit()
  {
    /**
     * Sempre que trocar a rota,
     * faz o scroll para o inicio do scroll de todos os sidenav-containers
     * que é uma div criada pelo componente side-nav
     */
    this.router.events.subscribe((path: any) =>
    {
      if (path.url != this.currentUrl)
      {
        let scrollableElements = document.getElementsByClassName("mat-drawer-content");
        for (let i = 0; i < scrollableElements.length; i++)
        {
          scrollableElements[i].scrollTop = 0;
        }
        this.currentUrl = path.url;
      }
    });
  }
}