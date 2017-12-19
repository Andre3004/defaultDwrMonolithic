import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import {AuthenticatedUserService} from "../authenticated-user/authenticated-user.service";
import {Router} from "@angular/router";
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'logged-menu',
  templateUrl: './logged-menu.component.html',
  styleUrls: ['./logged-menu.component.scss']
})
export class LoggedMenuComponent implements OnDestroy {
  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  authenticatedUser : any;


  userSubscription: Subscription;
  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/
  /**
   *
   * @param media
   */
  constructor( public authenticatedUserService: AuthenticatedUserService, public changeDetectionRef: ChangeDetectorRef, public router: Router )
  {

    this.authenticatedUser = authenticatedUserService.getObservedAuthenticatedUser();

    this.userSubscription = authenticatedUserService.authenticatedUserChanged.subscribe((user) => {
      this.authenticatedUser = user;
      this.changeDetectionRef.detectChanges();
    } );

  }

  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/
  /**
   *
   */
  ngOnDestroy()
  {
    if(this.userSubscription) this.userSubscription.unsubscribe();
  }
}
