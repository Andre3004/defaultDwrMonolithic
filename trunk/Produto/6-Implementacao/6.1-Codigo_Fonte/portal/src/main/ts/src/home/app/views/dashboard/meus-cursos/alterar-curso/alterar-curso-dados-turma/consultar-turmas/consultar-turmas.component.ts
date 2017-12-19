import { MatDialog, MatSnackBar } from '@angular/material';
import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { Broker } from 'eits-ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { TdDialogService } from "@covalent/core";


@Component({
  selector: 'consultar-turmas',
  templateUrl: './consultar-turmas.component.html',
  styleUrls: ['./consultar-turmas.component.scss']
})
export class ConsultarTurmasComponent implements OnInit
{


  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  curso: any = { id: this.activatedRoute.parent.parent.snapshot.params['id'] };

  /**
   *
   */
  turmas: any[];

  /**
   *
   */
  turmaIdToRemove: number;

  /*-------------------------------------------------------------------
  *                           CONSTRUCTOR
  *-------------------------------------------------------------------*/
  /**
   *
   * @param dialog
   */
  constructor(public dialog: MatDialog, public tdDialogService: TdDialogService, public viewContainerRef: ViewContainerRef,  public snackBar: MatSnackBar, public activatedRoute: ActivatedRoute, public router: Router)
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
    this.listTurmasByCursoId();
  }

  /**
   *
   */
  public listTurmasByCursoId(): void
  {
    Broker.of("turmaService").promise("listTurmasByCursoId", this.curso.id)
      .then((result) =>
      {
        if (result)
        {
          this.turmas = result.content;
        }
      })
      .catch((exception) =>
      {
      });
  }

  /**
   *
   * @param turma
   */
  alterarTurma(turma)
  {
    this.router.navigate([turma.id, 'dados-turma'], { relativeTo: this.activatedRoute });
  }

  /**
   *
   * @param turma
   */
  public getTipoTurma(turma)
  {
    switch (turma.tipoTurma)
    {
      case ("PRESENCIAL"):
        return "Presencial";
      case ("DISTANCIA"):
        return "Distância";
      case ("SEMIPRESENCIAL"):
        return "Semipresencial";
      default:
        return null;
    }
  }

  /**
 *
 */
  public removeTurma(turmaId: number)
  {
    this.turmaIdToRemove = turmaId;
    this.tdDialogService.openConfirm({
      message: 'A exclusão desta turma também irá remover todas as aulas e lotes vinculados a mesma, deseja continuar?',
      title: 'Confirmar exclusão da turma',
      viewContainerRef: this.viewContainerRef,
      cancelButton: 'Cancelar',
      acceptButton: 'Excluir turma',
    }).afterClosed().subscribe((accept: boolean) =>
    {
      if (accept)
      {
        Broker.of("turmaService").promise("removeTurma", this.turmaIdToRemove)
          .then(() =>
          {
            this.openSnackBar('Turma removida com sucesso');
            this.listTurmasByCursoId();
          })
          .catch((exception) =>
          {
            this.openSnackBar('Não foi possível remover a turma');
            console.log(exception);
          })
      }
      this.turmaIdToRemove = null;
    });
  }

  /**
   *
   */

  public nextStep()
  {
    this.router.navigate(["curso-publicado"],  {relativeTo: this.activatedRoute.parent.parent});
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string)
  {
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }
}
