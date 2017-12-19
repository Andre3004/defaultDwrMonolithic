import { MatSnackBar } from '@angular/material';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Broker } from 'eits-ngx';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'inserir-aula',
  templateUrl: './inserir-aula.component.html',
  styleUrls: ['./inserir-aula.component.css']
})
export class InserirAulaComponent implements OnInit
{


  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  @Input()
  aula: any;

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
    Broker.of("turmaService").promise("insertAula", this.aula)
      .then((result) =>
      {
        this.openSnackBar('Aula inserida com sucesso');
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
