import { MatDialog, MatSnackBar } from '@angular/material';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Broker } from 'eits-ngx';
import { ActivatedRoute } from '@angular/router';
import { textMasks } from "../../../../../../../../controls/text-masks/text-masks";
import * as moment from "moment";
import * as locales from "moment/min/locales";


@Component({
  selector: 'aula-form',
  templateUrl: './aula-form.component.html',
  styleUrls: ['./aula-form.component.css']
})
export class AulaFormComponent implements OnInit
{

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/
  /**
   * Data de hoje
   * @type {Date}
   */
  today: Date = new Date();

  /**
   * 
   */

   tomorrow: Date;
  /**
   *  Verifica se a data de inicio tem o intervalo aceitavel (maior que 45 dias a partir da data atual)
   */
  isInicioValidInterval: boolean = true;

  /**
   * 
   */

  diffBetweenTodayInicio: any;

  /**
   * 
   */

  daysToInicio: number;

  /**
   * @type {turma: any, inicio: Date, termino: Date}
   */
  @Input()
  aula :any = {
    turma: null,
    inicio: null,
    termino: null,
  };

  /**
   *
   */
  @Output()
  cancel: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  @Output()
  save: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  horarioInicio: string;

  /**
   *
   */
  horarioTermino: string;

  /**
   *
   */
  daysAfterLotes: number = 1;

  /**
   *
   */
  inicioAulas: Date;

  /**
   * 
   */
  minVallidDays: number = 45;


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

  /**
   *
   */
  masks = textMasks;

  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/
  /**
   *
   */
  ngOnInit()
  {
    this.getDataInicioFim();
    this.getDataInicioAulas();
    this.tomorrow = new Date();
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.tomorrow.setHours(0, 0, 0, 0);
  }
  
  /**
   *Função para avisar que a aula esta sendo criada com data inferior a 45 dias a partir da data atual. 
  */

  public getIsInicioValidInterval()
  {
    let minVallidDate = new Date(this.today);
    minVallidDate.setDate(minVallidDate.getDate() + this.minVallidDays);
    if (this.aula.inicio <= minVallidDate)
    {
      this.diffBetweenTodayInicio = moment(this.aula.inicio).diff(moment().startOf('day'), 'days')
      this.isInicioValidInterval = false;
    }
    else
    {
      this.diffBetweenTodayInicio = 0;
      this.isInicioValidInterval = true;
    }
  }
  
  /**
   * 
   */

  public getDataInicioAulas()
  {
    Broker.of("configuracaoService").promise("getInicioAulas")
      .then((result) =>
      {
        this.inicioAulas = result;
      })
      .catch((exception) =>
      {
        this.openSnackBar(exception.message)
      });
  }

  /**
   *
   * @param turmaForm
   */
  public saveAula(event: Event, formControl)
  {
    if (formControl.valid)
    {
      event.preventDefault();

      this.setDataInicioTermino();

      if (this.validaDataInicioTermino() && this.validaDataInicioTerminoLotes())
      {
        this.save.emit();
      }

    }
  }

  /**
   *
   */
  public cancelar()
  {
    this.cancel.emit();
  }

  /**
   *
   */
  public setDataInicioTermino(): void
  {
    let horarioInicioSplit: string[] = this.horarioInicio.split(":");
    let horaInicio = horarioInicioSplit[0];
    let minutoInicio = horarioInicioSplit[1];

    this.aula.inicio.setHours(horaInicio, minutoInicio, "00", "00")

    let horarioTerminoSplit: string[] = this.horarioTermino.split(":");
    let horaTermino = horarioTerminoSplit[0];
    let minutoTermino = horarioTerminoSplit[1];

    this.aula.termino.setHours(horaTermino, minutoTermino, "00", "00");
  }

  /**
   *
   */
  public validaDataInicioTermino(): boolean
  {
    // if (this.aula.inicio < this.inicioAulas)
    // {
    //   this.openSnackBar("A data de início das aulas deve ser após o dia " + moment(this.inicioAulas).locale("pt-br").format("D[ de ]MMMM[ de ]YYYY"));
    //   return false;
    // }
    if (this.aula.inicio >= this.tomorrow)
    {
      if (this.aula.inicio < this.aula.termino)
      {
        return true;
      }
      else
      {
        this.openSnackBar("A data de início deve ser menor que a data de término");
        return false;
      }
    }
    else
    {
      this.openSnackBar("A data de início deve ser ao menos depois de amanhã");
    }
  }

  /**
  *
  */
  public validaDataInicioTerminoLotes(): boolean
  {
    if (this.aula.turma.aulas && this.aula.turma.lotes[0] && this.aula.turma.lotes[0].termino)
    {
      let loteTermino = new Date(this.aula.turma.lotes[0].termino);
      loteTermino.setDate(loteTermino.getDate() + this.daysAfterLotes);
      if (this.aula.inicio)
      {
        if (this.aula.inicio < loteTermino)
        {
          this.openSnackBar("A data de início da aula deve ser ao menos 1 dia depois do término dos lotes.");
          return false;
        }
      }

      if (this.aula.termino)
      {
        if (this.aula.termino < loteTermino)
        {
          this.openSnackBar("A data de término da aula deve ser ao menos 1 dia depois do término dos lotes.");
          return false;
        }
      }
    }
    return true;
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
   */
  public getDataInicioFim(): void
  {
    if (this.aula.inicio)
    {
      this.horarioInicio = this.twoDigits(this.aula.inicio.getHours()) + ":" + this.twoDigits(this.aula.inicio.getMinutes());
    }

    if (this.aula.termino)
    {
      this.horarioTermino = this.twoDigits(this.aula.termino.getHours()) + ":" + this.twoDigits(this.aula.termino.getMinutes());
    }
  }

  /**
   *
   */
  public twoDigits(number: string): string
  {
    return ("0" + number).slice(-2);
  }
}

