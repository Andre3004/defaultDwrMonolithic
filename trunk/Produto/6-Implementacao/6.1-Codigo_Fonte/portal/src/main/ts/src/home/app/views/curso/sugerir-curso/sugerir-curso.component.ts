import { Component, OnInit } from "@angular/core";
import { MatDialogRef, MatSnackBar } from "@angular/material";
import { AuthenticatedUserService } from "../../../controls/authenticated-user/authenticated-user.service";
import { Broker } from "eits-ngx";

@Component({
  selector: 'home-sugerir-curso',
  templateUrl: './sugerir-curso.component.html',
  styleUrls: ['./sugerir-curso.component.css']
})
export class SugerirCursoComponent implements OnInit
{
  /*-------------------------------------------------------------------
  *                           ATTRIBUTES
  *-------------------------------------------------------------------*/

  /**
   *
   */
  public isUserAuthenticated: boolean;

  /**
   *
   */
  public aluno: any;

  /**
   *
   */
  public nomeCurso: string;

  /**
   *
   */
  public descricaoCurso: string;

  /**
   *
   */
  public areaConhecimentoSelected: any = [];

  /**
   *
   */
  public areaConhecimentoList: any[];

  /**
   *
   */
  public pageable = {//PageRequest
    size: 50,
    page: 0,
    sort: null
  };

  /*-------------------------------------------------------------------
  *                           CONSTRUCTORS
  *-------------------------------------------------------------------*/

  /**
   *
   * @param dialogRef
   * @param snackBar
   * @param authenticatedUserService
   */
  constructor(public dialogRef: MatDialogRef<SugerirCursoComponent>, public snackBar: MatSnackBar, public authenticatedUserService: AuthenticatedUserService) { }

  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/

  /**
   *
   */
  ngOnInit()
  {
    this.getAuthenticatedUser();
    this.listAreaConhecimentoByFilters("");
  }

  /**
   *
   */
  public getAuthenticatedUser()
  {
    this.authenticatedUserService.getPromiseAuthenticatedUser().then(
      (authenticatedUser) =>
      {
        if (authenticatedUser)
        {
          this.aluno = authenticatedUser;
          this.isUserAuthenticated = true;
        }
        else
        {
          this.aluno = {};
        }
      }
    )
  }

  /**
   *
   */
  public sugerirCurso()
  {
     Broker.of("cursoService").promise("insertCursoAndSendMailSugerirCurso", this.aluno.nome, this.aluno.email, this.nomeCurso, this.descricaoCurso, this.areaConhecimentoSelected[0])
        .then((result) =>
        {
          if(result){
            this.openSnackBar("Sua sugestão foi enviada para análise, aguarde e responderemos assim que possível");
            this.dialogRef.close();
          }
          else
          {
             this.openSnackBar("Um erro ocorreu durante o envio da sua sugestão, tente novamente");
          }
        })
        .catch((exception) =>
        {
          console.log(exception);
        })
  }

  /**
   *
   */
  public listAreaConhecimentoByFilters(filter: String)
  {
    if (this.areaConhecimentoSelected.length < 1)
    {
      Broker.of("areaConhecimentoService").promise("listAllAreaConhecimentoByFilters", filter, this.pageable)
        .then((result) =>
        {
          this.areaConhecimentoList = result.content;
        })
        .catch((exception) =>
        {
          console.log(exception);
        })
    }
    else
    {
      this.areaConhecimentoList = [];
    }
  }

   /**
   *
   * @param message
   */
  openSnackBar(message: string)
  {
    this.snackBar.open(message, "Fechar", {
      duration: 8000
    });
  }
}
