import { AuthenticatedUserService } from './../../../controls/authenticated-user/authenticated-user.service';
import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { Broker } from "eits-ngx";
import "rxjs/add/operator/switchMap";

@Component({
  selector: 'sugerir-area-conhecimento',
  templateUrl: 'sugerir-area-conhecimento.component.html',
  styleUrls: ['sugerir-area-conhecimento.component.css']
})
export class SugerirAreaConhecimentoComponent
{

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/
  /**
   *
   * @type {{nome: string; descricao: string}}
   */
  sugestaoAreaConhecimento = {
    nome: "",
    descricao: ""
  };

  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/

  /**
   *
   * @param dialogRef
   * @param authenticatedUserService
   */
  constructor(public dialogRef: MatDialogRef<SugerirAreaConhecimentoComponent>, public authenticatedUserService: AuthenticatedUserService)
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
    this.getAuthenticatedUser();
  }

  /**
   *
   * @param alunoId
   */
  public getAuthenticatedUser()
  {
    this.authenticatedUserService.getPromiseAuthenticatedUser()
      .then((result) =>
      {
        this.sugestaoAreaConhecimento.nome = result.nome;
      });
  }


}
