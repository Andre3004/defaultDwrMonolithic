import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'lotes-list',
  templateUrl: './lotes-list.component.html',
  styleUrls: ['./lotes-list.component.css']
})
export class LotesListComponent implements OnInit
{
  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  @Input()
  compra: any;
  /**
   *
   */
  @Input()
  turma: any;

  /**
   *
   */
  @Input()
  readOnly: boolean;

  /**
   *
   */
  @Output()
  onQuantidadeVagasChange: EventEmitter<any> = new EventEmitter;

  /**
   *
   */
  today = new Date();

  /**
   * 
   */
  totalMatriculas: number = 0;

  /**
   * 
   */



  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/

  /**
   *
   */
  constructor() { }

  /*-------------------------------------------------------------------
   *                           BEHAVIOR
   *-------------------------------------------------------------------*/

  /**
   *
   */
  ngOnInit()
  {
  }

  /**
   *
   */
  public quantidadeVagasChanged()
  {
    this.onQuantidadeVagasChange.emit();
  }

  /**
   *
   * @param lote
   */
  public adicionarMatricula(lote: any)
  {
    this.totalMatriculas = this.totalMatriculas + 1;
    if (!lote.quantidade && 0 < lote.vagasDisponiveis)
    {
      lote.quantidade = 1;
      this.quantidadeVagasChanged();
    }
    else
    {
      if (lote.quantidade < lote.vagasDisponiveis)
      {
        lote.quantidade++;
        this.quantidadeVagasChanged();
      }
    }
  }

  /**
   *
   * @param lote
   */
  public removerMatricula(lote: any)
  {
    this.totalMatriculas = this.totalMatriculas - 1;
    if (lote.quantidade > 0)
    {
      lote.quantidade--;
      this.quantidadeVagasChanged();
    }
  }

  /**
   *
   * @param lote
   * @returns {boolean}
   */
  public isCheio(lote: any): boolean
  {
    return lote.quantidade == lote.vagasDisponiveis;
  }

  /**
   *
   * @param lote
   * @returns {boolean}
   */
  public isVazio(lote: any)
  {
    return !lote.quantidade || lote.quantidade == 0;
  }

  /**
   * 
   */
  public clearLotesList()
  {
    this.turma.lotes.forEach((lote) =>{
      lote.quantidade = 0;
    }

    );
    this.totalMatriculas = 0;
  }
}
