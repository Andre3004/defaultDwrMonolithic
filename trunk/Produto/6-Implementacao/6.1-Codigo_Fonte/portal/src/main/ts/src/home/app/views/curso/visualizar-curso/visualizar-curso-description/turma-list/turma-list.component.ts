import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { Broker } from "eits-ngx";
import { MatDialog } from "@angular/material";
import { AuthenticatedUserService } from "../../../../../controls/authenticated-user/authenticated-user.service";
import { Subscription } from "rxjs/Subscription";
import {ConsultarMatriculasDialogComponent} from "../../../../compra/consultar-matriculas-dialog/consultar-matriculas-dialog.component";

@Component({
  selector: 'turma-list',
  templateUrl: './turma-list.component.html',
  styleUrls: ['./turma-list.component.css']
})
export class TurmaListComponent implements OnInit, OnDestroy
{
  /*-------------------------------------------------------------------
  *                           ATTRIBUTES
  *-------------------------------------------------------------------*/
  /**
   *
   */
  @Input()
  curso: any;

  /**
   *
   */
  turmas: any[];

  /**
   *
   */
  last: boolean;

  /**
   *
   */
  authenticatedUser: any;

  /**
   *
   * @type {{content: any; pageable: {size: number; page: number; sort: {orders: [{direction: string; property: string; nullHandlingHint: string}]}}}}
   */
  public page = {//PageImpl
    content: null,
    pageable: {//PageRequest
      size: 50,
      page: 0,
      sort: {
        orders: [{
          direction: "ASC",
          property: "inicio",
          nullHandlingHint: "NATIVE"
        }]
      }
    }
  };

  /**
   *
   * @type {{PRESENCIAL: string; DISTANCIA: string; SEMIPRESENCIAL: string}}
   */
  tipoTurma = {
    PRESENCIAL: "PRESENCIAL",
    DISTANCIA: "DISTANCIA",
    SEMIPRESENCIAL: "SEMIPRESENCIAL",
  };


  /**
   *
   */
  userSubscrption: Subscription;

  /*-------------------------------------------------------------------
  *                           CONSTRUCTORS
  *-------------------------------------------------------------------*/
  /**
   *
   */
  constructor(public dialog: MatDialog, public authenticatedUserService: AuthenticatedUserService)
  {
    this.userSubscrption = authenticatedUserService.authenticatedUserChanged.subscribe((authenticatedUser) =>
    {
      this.authenticatedUser = authenticatedUser;
    });
  }

  /*-------------------------------------------------------------------
  *                           BEHAVIORS
  *-------------------------------------------------------------------*/

  ngOnInit()
  {
    this.getAuthenticatedUser();
    this.listTurmasDisponiveisByCursoId(this.curso.id);
  }

  ngOnDestroy(): void
  {
    if(this.userSubscrption) this.userSubscrption.unsubscribe();
  }
  /**
   *
   */
  public getAuthenticatedUser(): void
  {
    this.authenticatedUserService.getPromiseAuthenticatedUser()
    .then((result) =>
    {
      if (result)
        {
          this.authenticatedUser = result;
        }
      })
  }

  /**
   *
   * @param turma
   */
  expandedEvent(turma): void
  {
    turma.isExpanded = true;
  }

  /**
   *
   */
  public getIsOwnerCurso():boolean
  {
    return this.authenticatedUser && this.curso.organizador && (this.authenticatedUser.isAdministrador || this.authenticatedUser.id == this.curso.organizador.id);
  }

  /**
    *
    */
  public listTurmasDisponiveisByCursoId(cursoId: number): void
  {
    Broker.of("turmaService").promise("listTurmasDisponiveisByCursoId", cursoId, null)
      .then((result) =>
      {
        this.turmas = result.content;
        this.curso.turmas = this.turmas;
        if(this.curso.turmas.length > 0)
        {
          this.turmas[0].isExpanded = true;
        }
      })
      .catch((message) =>
      {
        console.log(message);
      });
  }

  /**
   *
   * @param turma
   */
  public visualizarMatriculas(turma: any): void
  {
    this.dialog.open(ConsultarMatriculasDialogComponent, { data: turma });
  }

}
