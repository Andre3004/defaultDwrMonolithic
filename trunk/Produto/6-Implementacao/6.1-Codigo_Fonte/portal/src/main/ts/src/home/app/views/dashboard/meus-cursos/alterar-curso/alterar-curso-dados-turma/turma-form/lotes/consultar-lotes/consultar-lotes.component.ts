import { MatDialog, MatSnackBar } from '@angular/material';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Broker } from 'eits-ngx';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'consultar-lotes',
  templateUrl: './consultar-lotes.component.html',
  styleUrls: ['./consultar-lotes.component.scss']
})
export class ConsultarLotesComponent implements OnInit
{

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  @Input()
  turma: any;

  /**
   *
   */
  lotes: any;

  /**
   *
   */
  public pageable = {//PageRequest
    size: 50,
    page: 0,
    sort: {
      orders: [{
        direction: "ASC",
        property: "nome",
        nullHandlingHint: "NATIVE"
      }]
    }
  }

  /**
   *
   */
  @Output()
  onAlterarLote: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  @Output()
  onRemoveLote: EventEmitter<any> = new EventEmitter();

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
    this.listLotesByTurmaId();
  }

  /**
   *
   */
  public listLotesByTurmaId()
  {
    Broker.of("turmaService").promise("listLotesByTurmaId", this.turma.id, this.pageable)
      .then((result) =>
      {
        this.lotes = result.content;
        this.turma.lotes = this.lotes;
      })
      .catch((exception) =>
      {
        this.openSnackBar("Não foi possível consultar os lotes desta turma");
      });
  }
  /**
   *
   * @param lote
   */
  removeLote(lote: any)
  {
    this.onRemoveLote.emit(lote);
  }

  /**
   *
   * @param lote
   */
  public alterarLote(lote: any)
  {
    this.onAlterarLote.emit(lote);
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
