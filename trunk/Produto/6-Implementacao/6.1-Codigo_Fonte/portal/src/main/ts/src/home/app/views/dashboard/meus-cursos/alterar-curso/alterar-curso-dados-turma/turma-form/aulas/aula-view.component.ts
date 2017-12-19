import { MatDialog, MatSnackBar } from '@angular/material';
import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConsultarAulasComponent } from "./consultar-aulas/consultar-aulas.component";
import { Broker } from "eits-ngx";


@Component({
  selector: 'aula-view',
  templateUrl: './aula-view.component.html',
  styleUrls: ['./aula-view.component.css']
})
export class AulaViewComponent implements OnInit
{


  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  @ViewChild(ConsultarAulasComponent)
  consultarAulasComponent;

  /**
   *
   */
  @Input()
  turma: any;

  /**
   *
   */
  @Output()
  onContinue: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  aulaToUpdate: any;

  /**
   *
   */
  aulaToInsert: any;

  /*-------------------------------------------------------------------
  *                           CONSTRUCTOR
  *-------------------------------------------------------------------*/
  /**
   *
   * @param dialog
   */
  constructor(public dialog: MatDialog, public activatedRoute: ActivatedRoute, public snackBar: MatSnackBar)
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
    Broker.of("turmaService").promise("listAulasByTurmaId", this.turma.id, null)
      .then((result) =>
      {
        if (!result.content.length)
        {
          this.initAulaToInsert();
        }
      })
      .catch((exception) =>
      {
        this.openSnackBar("Não foi possível consultar as aulas desta turma");
        console.log(exception.message);
      });
  }

  public listAulasByTurmaId(): void
  {
    this.consultarAulasComponent.listAulasByTurmaId();
  }

  /**
   *
   */
  public continue(): void
  {
    if (this.consultarAulasComponent.aulas && this.consultarAulasComponent.aulas.length)
    {
      this.onContinue.emit();
    }
    else
    {
      this.openSnackBar("Você deve cadastrar ao menos uma aula");
    }
  }

  /**
   *
   */
  public alterarAula(aula: any): void
  {
    this.aulaToUpdate = aula;
  }

  /**
   *
   */
  public aulaSaved(): void
  {
    this.aulaToUpdate = null;
  }

  /**
   *
   */
  public initAulaToInsert(): void
  {
    this.aulaToInsert = {
      turma: this.turma,
      inicio: null,
      termino: null,
    }
  }

  /**
   *
   */
  public initAulaToUpdate(aula: any)
  {
    if (!this.aulaToInsert && !this.aulaToUpdate)
    {
      this.aulaToUpdate = aula;
      this.aulaToUpdate.turma = this.turma; //Turma com o bind do componente pai
    }
    else
    {
      this.openSnackBar("Antes você deve finalizar ou cancelar o formulário atual.");
    }
  }

  /**
   *
   */
  public resetAulaToInsert(): void
  {
    this.aulaToInsert = null;
    this.consultarAulasComponent.listAulasByTurmaId();
  }

  /**
   *
   */
  public resetAulaToUpdate(aula: any): void
  {
    this.aulaToUpdate = null;
    this.consultarAulasComponent.listAulasByTurmaId();
  }


  /**
   *
   * @param message
   */
  public openSnackBar(message: string): void
  {
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }

  /**
 *
 * @param aula
 */
  public removeAula(aula: any)
  {
    if (!this.aulaToInsert && !this.aulaToUpdate)
    {
      Broker.of("turmaService").promise("removeAula", aula.id)
        .then(() =>
        {
          this.openSnackBar('Aula removida com sucesso');
          this.listAulasByTurmaId();
        })
        .catch((exception) =>
        {
          this.openSnackBar('Não foi possível remover a aula');
          console.log(exception);
        })
    }
    else
    {
      this.openSnackBar("Antes você deve finalizar ou cancelar o formulário atual.");
    }
  }
}
