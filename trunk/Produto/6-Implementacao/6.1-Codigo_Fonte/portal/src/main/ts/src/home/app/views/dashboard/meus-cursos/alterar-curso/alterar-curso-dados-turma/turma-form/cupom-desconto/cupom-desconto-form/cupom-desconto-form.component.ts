import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatSnackBar, MatSliderModule } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { textMasks } from '../../../../../../../../controls/text-masks/text-masks';
import { FormControl, Validators } from '@angular/forms';
import { Broker } from 'eits-ngx';
import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'cupom-desconto-form',
  templateUrl: './cupom-desconto-form.component.html',
  styleUrls: ['./cupom-desconto-form.component.css']
})
export class CupomDescontoFormComponent implements OnInit
{
  /**
   * 
   */
  @Input()
  cupomDesconto: any = {
    turma: null,
    dataInicio: null,
    dataTermino: null,
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
  quantidade = new FormControl('', [Validators.required, Validators.min(0)]);

  /**
   * 
   */
  isGratuito: Boolean = false;

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

  /**
   * Data de hoje
   * @type {Date}
   */
  today: Date = new Date();

  /**
   *
   */
  tomorrow: Date;




  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/

  /**
   *
   * @param dialog
   */
  constructor(private dialogService: TdDialogService, public activatedRoute: ActivatedRoute, public snackBar: MatSnackBar)
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
    Broker.of("turmaService").promise("findTurmaById", this.cupomDesconto.turma.id)
      .then((result) =>
      {
        this.cupomDesconto.turma = result;
      })
      .catch((exception) => 
      {
        console.log(exception);
      });

    this.getDataInicioFim();

    this.tomorrow = new Date();
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.tomorrow.setHours(0, 0, 0, 0);

    if (this.cupomDesconto.valor == 100)
    {
      this.isGratuito = true;
    }
  }


  /**
   *
   * @param 
   */
  public saveCupom()
  {
    this.setDataInicioTermino();
    if (!this.cupomDesconto.valor || (this.cupomDesconto.valor > 90 && this.cupomDesconto.valor < 100))
    {
      this.openSnackBar('Valor do desconto inválido')
    }
    else
    if (this.validaDataInicioTermino() && this.validaDataInicioTerminoAulas())
    {
      this.save.emit(this.cupomDesconto);
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
    if (this.cupomDesconto.dataInicio)
    {
      if (this.horarioInicio)
      {
        let horarioInicioSplit: string[] = this.horarioInicio.split(":");
        let horaInicio = horarioInicioSplit[0];
        let minutoInicio = horarioInicioSplit[1];

        this.cupomDesconto.dataInicio.setHours(horaInicio, minutoInicio, "00", "00");
      }
      else
      {
        this.cupomDesconto.inicio.setHours("00", "00", "00", "00");// Para não preencher com lixo de memória
      }
    }

    if (this.cupomDesconto.dataTermino)
    {
      if (this.horarioTermino)
      {
        let horarioTerminoSplit: string[] = this.horarioTermino.split(":");
        let horaTermino = horarioTerminoSplit[0];
        let minutoTermino = horarioTerminoSplit[1];

        this.cupomDesconto.dataTermino.setHours(horaTermino, minutoTermino, "00", "00");
      }
      else
      {
        this.cupomDesconto.dataTermino.setHours("00", "00", "00", "00");
      }
    }
  }

  /**
   *
   */
  public validaDataInicioTermino(): boolean
  {
    if (this.cupomDesconto.dataInicio)
    {
      if (this.cupomDesconto.dataInicio >= this.today)
      {
        if (this.cupomDesconto.dataInicio && this.cupomDesconto.dataTermino)
        {
          if (this.cupomDesconto.dataInicio < this.cupomDesconto.dataTermino)
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
      if (this.cupomDesconto.dataTermino)
      {
        if (this.cupomDesconto.dataTermino >= this.today)
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
    if (this.cupomDesconto.turma.aulas && this.cupomDesconto.turma.aulas[0])
    {
      let aulaInicio = new Date(this.cupomDesconto.turma.aulas[0].inicio);
      aulaInicio.setDate(aulaInicio.getDate() - this.daysBeforeAulas);
      if (this.cupomDesconto.dataInicio)
      {
        if (this.cupomDesconto.dataInicio > aulaInicio)
        {
          this.openSnackBar("A data de início do cupom deve ser ao menos 1 dia antes do início das aulas.");
          return false;
        }
      }

      if (this.cupomDesconto.dataTermino)
      {
        if (this.cupomDesconto.dataTermino > aulaInicio)
        {
          this.openSnackBar("A data de término do cupom deve ser ao menos 1 dia antes do início das aulas.");
          return false;
        }
      }
    }

    return true;
  }

  /**
   * 
   */
  public changeCheckboxGratuito()
  {
    if (this.isGratuito)
      this.cupomDesconto.valor = 100;
    else
      this.cupomDesconto.valor = 90;

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
    if (this.cupomDesconto.dataInicio)
    {
      this.horarioInicio = this.twoDigits(this.cupomDesconto.dataInicio.getHours()) + ":" + this.twoDigits(this.cupomDesconto.dataInicio.getMinutes());
    }

    if (this.cupomDesconto.termino)
    {
      this.horarioTermino = this.twoDigits(this.cupomDesconto.dataTermino.getHours()) + ":" + this.twoDigits(this.cupomDesconto.dataTermino.getMinutes());
    }
  }

  /**
   *
   */
  public twoDigits(number: string): string
  {
    return ("0" + number).slice(-2);
  }

  /**
   * 
   */
  public openInfoDialog()
  {
    this.dialogService.openAlert({
      message: 'O desconto sobre o valor da inscrição é definido em percentagem, variando de 1% a 100%. Para descontos de até 90%, a taxa de 10% praticada pela TFC será cobrada sobre o valor real da inscrição e não sobre o valor com desconto. Descontos de 100% são caracterizados como inscrições gratuitas e, portanto, não será aplicada a taxa de 10% pela utilização da plataforma. Para utilizar o cupom de desconto o valor total da compra deve ser superior a R$ 50,00.',
      title: 'Valor do desconto',
      closeButton: 'Fechar'
    });

  }

}

