import { Component, OnInit } from "@angular/core";
import { MatDialogRef, MatSnackBar } from "@angular/material";
import { AuthenticatedUserService } from "../../../controls/authenticated-user/authenticated-user.service";
import { Broker } from "eits-ngx";

@Component({
  selector: 'home-termos-uso',
  templateUrl: './termos-uso.component.html',
  styleUrls: ['./termos-uso.component.css']
})
export class TermosUsoViewComponent implements OnInit
{
  /*-------------------------------------------------------------------
  *                           ATTRIBUTES
  *-------------------------------------------------------------------*/
  /**
   *
   */
  public termosUso: string;

  /*-------------------------------------------------------------------
  *                           CONSTRUCTORS
  *-------------------------------------------------------------------*/

  /**
   *
   */
  constructor()
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
    this.getTermosUso();
  }

  /**
   *
   */
  public getTermosUso()
  {
    Broker.of("configuracaoService").promise("getTermosUso")
      .then((result) =>
      {
        if(result)
        {
          this.termosUso = result;
        }
      });
  }
}
