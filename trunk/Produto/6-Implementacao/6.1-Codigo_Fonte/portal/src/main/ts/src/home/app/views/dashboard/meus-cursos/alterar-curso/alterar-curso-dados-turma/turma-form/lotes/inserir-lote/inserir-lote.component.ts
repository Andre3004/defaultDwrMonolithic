import { MatSnackBar } from '@angular/material';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Broker } from 'eits-ngx';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'inserir-lote',
  templateUrl: './inserir-lote.component.html',
  styleUrls: ['./inserir-lote.component.css']
})
export class InserirLoteComponent implements OnInit
{

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/
  /**
   *
   */
  @Input()
  lote :any;

  /**
   *
   */
  @Output()
  onSave: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  @Output()
  onCancel: EventEmitter<any> = new EventEmitter();

  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/
  /**
   *
   * @param dialog
   */
  constructor(public activatedRoute: ActivatedRoute, public snackBar: MatSnackBar, public router: Router)
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
  }

  /**
   *
   * @param turmaForm
   */
  public save()
  {
    Broker.of("turmaService").promise("insertLote", this.lote)
      .then((result) => {
        this.openSnackBar('Lote inserido com sucesso');
        this.onSave.emit();
      })
      .catch((exception) => {
        this.openSnackBar(exception.message)
      });
  }

  /**
   *
   */
  public cancel()
  {
    this.onCancel.emit();
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
