import { CursoCardComponent } from './../../consultar-cursos-aprovados/curso-card/curso-card.component';
import { VisualizarCursoComponent } from './../visualizar-curso.component';
import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticatedUserService } from "../../../../controls/authenticated-user/authenticated-user.service";
import { MatDialog, MatSnackBar } from "@angular/material";
import { Broker } from "eits-ngx";
import { RecusarCursoComponent } from "../recusar-curso/recusar-curso.component";
import { CodigoIncorporacaoComponent } from "../../codigo-incorporacao/codigo-incorporacao.component";
import { ConfirmDialogComponent } from "../../../../controls/confirm-dialog/confirm-dialog.component";
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'visualizar-curso-header',
  templateUrl: './visualizar-curso-header.component.html',
  styleUrls: ['./visualizar-curso-header.component.css']
})
export class VisualizarCursoHeaderComponent implements OnInit, OnDestroy
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
  @Input()
  withMenu: boolean;

  /**
  *
  */
  mdMenu: any;

  /**
   *
   */
  authenticatedUser: any;

  /**
   * 
   */
  areaConhecimento: any;

  /**
   * 
   */
  private userSubscription: Subscription;

  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/
  /**
   * 
   * @param activatedRoute 
   * @param snackBar 
   * @param router 
   * @param dialog 
   * @param authenticatedUserService 
   * @param changeDetectionRef 
   */
  constructor(public activatedRoute: ActivatedRoute, public snackBar: MatSnackBar, public router: Router, public dialog: MatDialog, public authenticatedUserService: AuthenticatedUserService, public changeDetectionRef: ChangeDetectorRef)
  {
    this.userSubscription = authenticatedUserService.authenticatedUserChanged.subscribe((user) => this.authenticatedUser = user);
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
    this.listCursoAreaConhecimentoByCursoIdWithoutParent(this.curso.id, null);
  }

  /**
   * 
   */
  ngOnDestroy()
  {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

  /**
   *
   * @param areaConhecimento
   */
  public listCursosByAreaConhecimento(areaConhecimento: any): void
  {
    this.router.navigate(['/cursos/areas-conhecimento', areaConhecimento.id]);
  }

  /**
   *
   */
  public getAuthenticatedUser()
  {
    this.authenticatedUserService.getPromiseAuthenticatedUser()
      .then((authenticatedUser) =>
      {
        if (authenticatedUser)
        {
          this.authenticatedUser = authenticatedUser;
        }
      });
  }

  /**
 *
 * @param cursoId
 * @param page
 */
  public listCursoAreaConhecimentoByCursoIdWithoutParent(cursoId, page: any)
  {
    Broker.of("cursoService").promise("listCursoAreaConhecimentoByCursoIdWithoutParent", cursoId, page)
      .then((result) =>
      {
        if (result.content)
        {
          this.curso.areaConhecimento = result.content[0].areaConhecimento;
          this.areaConhecimento = this.curso.areaConhecimento;
        }
      }).catch((exception) =>
      {
        console.log(exception.message)
      });
  }

  /**
   *
   * @param curso
   */
  public removeCursoAndSendMailRecusado(curso: any): void
  {
    let dialogRef = this.dialog.open(RecusarCursoComponent);

    dialogRef.afterClosed().subscribe(justificativa =>
    {
      if (justificativa)
      {
        Broker.of("cursoService").promise("removeCursoAndSendMailRecusado", curso.id, justificativa)
          .then(() =>
          {
            this.router.navigate(['../'], { relativeTo: this.activatedRoute }); //TODO não funciona na visualização normal do curso. Possívelmente devido as alterações do lazyloading
            this.snackBar.open('Curso recusado com sucesso', 'Fechar', {
              duration: 3000
            });
          })
          .catch((message) =>
          {
            console.log(message);
          });
      }
    });
  }

  /**
   *
   * @param curso
   */
  public updateCursoWithStatusAprovado(curso: any): any
  {
    Broker.of("cursoService").promise("updateCursoWithStatusAprovado", curso.id)
      .then((result) =>
      {
        this.populateCurso(result);
        this.snackBar.open('Curso aprovado com sucesso', 'Fechar', {
          duration: 3000
        });
      })
      .catch((message) =>
      {
        console.log(message);
      });
  }

  /**
   *
   * @param curso
   */
  public updateCursoWithStatusPendente(curso: any): any
  {
    Broker.of("cursoService").promise("updateCursoWithStatusPendente", curso.id)
      .then((result) =>
      {
        this.populateCurso(result);
        this.snackBar.open('Curso enviado para aprovação', 'Fechar', {
          duration: 3000
        });
      })
      .catch((exception) =>
      {
        this.snackBar.open(exception.message, 'Fechar', {
          duration: 3000
        });
      });
  }


  /**
   *
   * @param curso
   */
  public removeCurso(curso: any): any
  {
    let dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          text: "Deseja realmente excluir o curso?",
          confirm: "Sim",
          cancel: "Não"
        }
      }
    );

    dialogRef.afterClosed().subscribe(remover =>
    {
      if (remover)
      {
        Broker.of("cursoService").promise("removeCurso", curso.id)
          .then(() =>
          {
            this.router.navigate(['../'], { relativeTo: this.activatedRoute }); //TODO não funciona na visualização normal do curso. Possívelmente devido as alterações do lazyloading
            this.snackBar.open('Curso removido com sucesso', 'Fechar', {
              duration: 3000
            });
          })
          .catch((message) =>
          {
            console.log(message);
          });
      }
    });
  }

  /**
 * Popula curso com dados específico.
   Desta forma sempre que um curso é aprovado, removido ou recusado, os dados do curso não são recarregados completamente na tela
 */
  public populateCurso(curso: any): any
  {
    this.curso.aprovado = curso.aprovado;
    this.curso.excluido = curso.excluido;
    this.curso.pendente = curso.pendente;
    this.curso.rejeitado = curso.rejeitado;
    this.curso.rascunho = curso.rascunho;
  }

  /**
   *
   * @param curso
   */
  public alterarCurso(curso)
  {
    this.router.navigate(['dashboard/meus-cursos/', curso.id, 'alterar', 'dados-curso']);
  }

  /**
   * 
   */
  public enviarAprovacao(curso)
  {
    this.router.navigate(['dashboard/meus-cursos/', curso.id, 'alterar', 'curso-publicado'])
  }

  /**
 *
 */
  public gerarCodigoIncorporacao()
  {
    let dialogRef = this.dialog.open(CodigoIncorporacaoComponent, {
      data: this.curso,
    });
  }
  
  /**
   * 
   * @param curso 
   */
  public parseNomeUrl = CursoCardComponent.parseNomeUrl;
}
