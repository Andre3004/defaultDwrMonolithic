import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Broker } from 'eits-ngx';

@Component({
  selector: 'alterar-cupom-desconto',
  templateUrl: './alterar-cupom-desconto.component.html',
  styleUrls: ['./alterar-cupom-desconto.component.css']
})
export class AlterarCupomDescontoComponent implements OnInit
{
  /**
   * 
   */
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
    Broker.of("turmaService").promise("updateCupomDesconto", this.cupomDesconto)
      .then((result) =>
      {
        this.openSnackBar('Cupom alterado com sucesso');
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
