import { MatDialog, MatSnackBar } from '@angular/material';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Broker } from 'eits-ngx';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { textMasks } from "../../../../../../../../controls/text-masks/text-masks";


@Component({
  selector: 'lote-form',
  templateUrl: './lote-form.component.html',
  styleUrls: ['./lote-form.component.css']
})
export class LoteFormComponent implements OnInit
{

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/
  /**
   *
   */
  maximoVagas: number;

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
    * 
    */
  tooltipLimiteMatriculas: String = "Número máximo de matrículas que podem ser disponibilizadas para este lote, não pode ser maior que o número de vagas da turma!"

  /**
   * 
   */
  tooltipVagasReservadas: String = "Número de vagas exclusivas para este lote, estas vagas não podem ser usadas por outros lotes."
  
  @Input()
  lote: any = {
    vagasReservadas: null,
    turma:
    {
      id: null,
      quantidadeVagasNaoReservadas: 0,
      quantidadeVagasReservadas: 0
    },
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
  remove: EventEmitter<number> = new EventEmitter();

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
  masks: any = textMasks;

  /**
   *
   */
  daysBeforeAulas: number = 1;

  /*-------------------------------------------------------------------
   *                           VALIDATORS
   *-------------------------------------------------------------------*/
  /**
   *
   * @type {FormControl}
   */
  preco = new FormControl('', [Validators.required, Validators.min(0)]);

  /**
   *
   * @type {FormControl}
   */
  vagasReservadas = new FormControl('', [Validators.min(0), Validators.max(this.maximoVagas)]);

  /**
   *
   * @type {FormControl}
   */
  limiteMatriculas = new FormControl('', [Validators.min(this.lote.vagasReservadas), Validators.max(this.lote.vagasReservadas + (this.lote.vagasReservadas ? this.maximoVagas - this.lote.vagasReservadas : this.maximoVagas))]);

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
    Broker.of("turmaService").promise("findTurmaById", this.lote.turma.id)
      .then((result) =>
      {
        this.lote.turma = result;
        if (this.lote.vagasReservadas)
        {
          this.maximoVagas = this.lote.turma.quantidadeVagasNaoReservadas + this.lote.vagasReservadas;
        }
        else
        {
          this.maximoVagas = this.lote.turma.quantidadeVagasNaoReservadas;
        }
      })
      .catch((exception) => 
      {
        console.log(exception);    
      });

      this.getDataInicioFim();
        
      this.tomorrow = new Date();
      this.tomorrow.setDate(this.tomorrow.getDate() + 1);
      this.tomorrow.setHours(0, 0, 0, 0);

      if (this.lote.turma.curso.isGratuito)
      {
        this.preco.disable();
        this.lote.preco = 0.00;
      }
  }

  /**
   *
   * @param turmaForm
   */
  public saveLote(loteForm)
  {
    if (this.lote.preco < 0) return;
    if (loteForm.valid)
    {
      this.setDataInicioTermino();

      if (this.validaDataInicioTermino() && this.validaDataInicioTerminoAulas())
      {
        this.save.emit(this.lote);
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
    if (this.lote.inicio)
    {
      if (this.horarioInicio)
      {
        let horarioInicioSplit: string[] = this.horarioInicio.split(":");
        let horaInicio = horarioInicioSplit[0];
        let minutoInicio = horarioInicioSplit[1];

        this.lote.inicio.setHours(horaInicio, minutoInicio, "00", "00");
      }
      else
      {
        this.lote.inicio.setHours("00", "00", "00", "00");// Para não preencher com lixo de memória
      }
    }

    if (this.lote.termino)
    {
      if (this.horarioTermino)
      {
        let horarioTerminoSplit: string[] = this.horarioTermino.split(":");
        let horaTermino = horarioTerminoSplit[0];
        let minutoTermino = horarioTerminoSplit[1];

        this.lote.termino.setHours(horaTermino, minutoTermino, "00", "00");
      }
      else
      {
        this.lote.termino.setHours("00", "00", "00", "00");
      }
    }
  }

  /**
   *
   */
  public validaDataInicioTermino(): boolean
  {
    if (this.lote.inicio)
    {
      if (this.lote.inicio >= this.today)
      {
        if (this.lote.inicio && this.lote.termino)
        {
          if (this.lote.inicio < this.lote.termino)
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
          return true;
        }
      }
      else
      {
        this.openSnackBar("A data de início deve ser maior que a data de hoje");
        return false;
      }
    }
    else
    {
      if (this.lote.termino)
      {
        if (this.lote.termino >= this.today)
        {
          return true;
        }
        else
        {
          this.openSnackBar("A data de término deve ser maior que a data de hoje");
          return false;
        }
      }
      else
      {
        return true;
      }
    }
  }

  /**
   *
   */
  public validaDataInicioTerminoAulas(): boolean
  {
    if (this.lote.turma.aulas && this.lote.turma.aulas[0])
    {
      let aulaInicio = new Date(this.lote.turma.aulas[0].inicio);
      aulaInicio.setDate(aulaInicio.getDate() - this.daysBeforeAulas);
      if (this.lote.inicio)
      {
        if (this.lote.inicio > aulaInicio)
        {
          this.openSnackBar("A data de início do lote deve ser ao menos 1 dia antes do início das aulas.");
          return false;
        }
      }

      if (this.lote.termino)
      {
        if (this.lote.termino > aulaInicio)
        {
          this.openSnackBar("A data de término do lote deve ser ao menos 1 dia antes do início das aulas.");
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
    if (this.lote.inicio)
    {
      this.horarioInicio = this.twoDigits(this.lote.inicio.getHours()) + ":" + this.twoDigits(this.lote.inicio.getMinutes());
    }

    if (this.lote.termino)
    {
      this.horarioTermino = this.twoDigits(this.lote.termino.getHours()) + ":" + this.twoDigits(this.lote.termino.getMinutes());
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

