import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Broker } from 'eits-ngx';

@Component({
  selector: 'inserir-cupom-desconto',
  templateUrl: './inserir-cupom-desconto.component.html',
  styleUrls: ['./inserir-cupom-desconto.component.css']
})
export class InserirCupomDescontoComponent implements OnInit
{

  @Input()
  cupomDesconto: any;

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

  /**
   *
   */

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
    Broker.of("turmaService").promise("insertCupomDesconto", this.cupomDesconto)
      .then((result) =>
      {
        this.openSnackBar('Cupom de desconto inserido com sucesso');
        this.onSave.emit();
      })
      .catch((exception) =>
      {
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
