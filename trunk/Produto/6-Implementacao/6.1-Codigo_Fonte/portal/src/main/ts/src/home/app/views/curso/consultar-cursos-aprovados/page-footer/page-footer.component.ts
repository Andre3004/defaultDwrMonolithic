import { AuthenticatedUserService } from './../../../../controls/authenticated-user/authenticated-user.service';
import { Component } from "@angular/core";

@Component({
  selector: 'page-footer',
  templateUrl: './page-footer.component.html',
  styleUrls: ['./page-footer.component.css']
})
export class PageFooterComponent
{

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   * 
   */
  authenticatedUser: any;


  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/

  /**
   *
   */
  constructor(public authenticatedUserService: AuthenticatedUserService)
  {
    this.authenticatedUser = authenticatedUserService.getPromiseAuthenticatedUser()
      .then((authenticatedUser) =>
      {
        this.authenticatedUser = authenticatedUser;
      })
      .catch((exception) =>
      {
      })
  }

  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/
}
