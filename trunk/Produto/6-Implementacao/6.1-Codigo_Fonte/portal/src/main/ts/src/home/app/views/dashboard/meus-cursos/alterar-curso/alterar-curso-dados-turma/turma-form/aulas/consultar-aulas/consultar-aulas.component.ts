import { MatDialog, MatSnackBar } from '@angular/material';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Broker } from 'eits-ngx';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'consultar-aulas',
  templateUrl: './consultar-aulas.component.html',
  styleUrls: ['./consultar-aulas.component.scss']
})
export class ConsultarAulasComponent implements OnInit
{

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  @Input()
  turma: any;

  /**
   *
   */
  @Input()
  readOnly: boolean;

  /**
   *
   */
  @Input()
  backgroundColor: string = "bgc-blue-grey-50";

  /**
   *
   */
  @Output()
  onAlterarAula: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  @Output()
  onRemoveAula: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  aulas: any[];

  /**
   *
   * @type {size: number; page: number; sort: {orders: [{direction: string; property: string; nullHandlingHint: string}]}}
   */
  public pageable = {
    size: 100,
    page: 0,
    sort: {
      orders: [{
        direction: "ASC",
        property: "inicio",
        nullHandlingHint: "NATIVE"
      }]
    }
  };

  /*-------------------------------------------------------------------
  *                           CONSTRUCTOR
  *-------------------------------------------------------------------*/
  /**
   *
   * @param dialog
   */
  constructor(public dialog: MatDialog, public activatedRoute: ActivatedRoute, public router: Router, public snackBar: MatSnackBar)
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
    this.listAulasByTurmaId();
  }

  public listAulasByTurmaId()
  {
    Broker.of("turmaService").promise("listAulasByTurmaId", this.turma.id, this.pageable)
      .then((result) =>
      {
        this.aulas = result.content;
        this.turma.aulas = this.aulas;
      })
      .catch((exception) =>
      {
        this.openSnackBar("Não foi possível consultar as aulas desta turma");
        console.log(exception.message);
      });
  }

  /**
   *
   * @param aula
   */
  alterarAula(aula)
  {
    this.onAlterarAula.emit(aula);
  }

  /**
   *
   * @param aula
   */
  public removeAula(aula: any)
  {
    this.onRemoveAula.emit(aula);
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
