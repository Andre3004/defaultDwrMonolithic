import { Broker } from 'eits-ngx';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { textMasks } from "../../../../../../controls/text-masks/text-masks";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'dados-deposito',
  templateUrl: './dados-deposito.component.html',
  styleUrls: ['./dados-deposito.component.css']
})
export class DadosDepositoComponent implements OnInit
{


  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  public bancoSelected: any = [];

  /**
   *
   */
  public bancosList: any[];

  /**
  *
  */
  masks = textMasks;

  /**
   *
   * @type {{dadosDeposito: {banco: any; dadosDepositoIsEmpresa: boolean}}}
   */
  @Input()
  public curso: any = {
    dadosDeposito: {
      banco: null,
      dadosDepositoIsEmpresa: false,
      acceptAlunoEstrangeiro: null,
    },
    tipoContaBancaria: null,
  };

  /**
   *
   */
  @Output()
  onComplete: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  @Output()
  onChange: EventEmitter<any> = new EventEmitter();
  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/
  /**
   *
   */
  constructor(public snackBar: MatSnackBar)
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
    if (this.curso.dadosDeposito.banco)
    {
      this.bancoSelected.push(this.curso.dadosDeposito.banco);
    }
    if (!this.curso.dadosDeposito.tipoContaBancaria)
    {
      this.curso.dadosDeposito.tipoContaBancaria = 'CONTA_CORRENTE';
    }
  }

  /**
   *
   */
  public submit(event: Event): void
  {
    if (this.curso.dadosDeposito.dadosDepositoIsEmpresa)
    {
      if (!(this.getNumbers(this.curso.dadosDeposito.documento).length >= 12))
      {
        this.error('CNPJ inválido');
        return;
      }
    }
    else
    {
      if (this.getNumbers(this.curso.dadosDeposito.documento).length >= 12)
      {
        this.error('CPF inválido');
        return;
      }
    }

    event.preventDefault();
    this.onComplete.emit();
  }

  /**
   *
   */
  public onChangeEmit()
  {
    this.onChange.emit();
  }

  /**
   *
   * @param banco
   */
  public addBanco(banco:any)
  {
    this.curso.dadosDeposito.banco = banco;
  }

  /**
   *
   */
  public listBancosByFilters(filter: String)
  {
    if (this.bancoSelected.length < 1) {
      Broker.of("cursoService").promise("listBancosByFilters", filter, { size: 150, page: 0, sort: null })
        .then((result) => {
          this.bancosList = result.content;
        })
        .catch((exception) => {
          console.log(exception);
        })
    }
    else
    {
      this.bancosList = [];
    }
  }

  /**
   *
   */
  getNumbers(str: string)
  {
    return str.replace(/[^0-9]/g, '');// Sobrescreve tudo o que nao é número com vazio
  }

  /**
   *
   * @param message
   */
  public error(message: string)
  {
    this.openSnackBar(message);
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
