import {Component, OnInit} from "@angular/core";
import { RealizarLoginComponent } from "../../views/aluno/realizar-login/realizar-login.component";
import { MatDialog } from "@angular/material";
import { AuthenticatedUserService } from "../authenticated-user/authenticated-user.service";

@Component({
  selector: 'anonymous-menu',
  templateUrl: './anonymous-menu.component.html',
  styleUrls: ['./anonymous-menu.component.css']
})
export class AnonymousMenuComponent implements OnInit
{
  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/
  constructor( public dialog: MatDialog, public authenticatedUserService: AuthenticatedUserService) { }


  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/
  ngOnInit()
  {
  }
  
  /**
  *
  */
  public login(): void
  {
    let dialogRef = this.dialog.open(RealizarLoginComponent);
  }

}
