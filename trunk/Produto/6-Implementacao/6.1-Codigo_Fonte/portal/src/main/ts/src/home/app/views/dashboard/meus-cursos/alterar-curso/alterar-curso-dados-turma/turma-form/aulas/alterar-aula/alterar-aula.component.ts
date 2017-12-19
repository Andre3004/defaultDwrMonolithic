import { MatSnackBar } from '@angular/material';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Broker } from 'eits-ngx';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'alterar-aula',
  templateUrl: './alterar-aula.component.html',
  styleUrls: ['./alterar-aula.component.css']
})
export class AlterarAulaComponent implements OnInit
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
    Broker.of("turmaService").promise("updateAula", this.aula)
      .then((result) => {
        this.openSnackBar('Aula alterada com sucesso');
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
