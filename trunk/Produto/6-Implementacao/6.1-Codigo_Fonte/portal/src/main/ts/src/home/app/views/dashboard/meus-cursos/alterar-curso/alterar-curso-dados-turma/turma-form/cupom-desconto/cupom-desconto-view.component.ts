import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Broker } from 'eits-ngx';
import { ConsultarCuponsDescontoComponent } from './consultar-cupons-desconto/consultar-cupons-desconto.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cupom-desconto-view',
  templateUrl: './cupom-desconto-view.component.html',
  styleUrls: ['./cupom-desconto-view.component.css']
})
export class CupomDescontoViewComponent implements OnInit
{
  /**
   * 
   */
  @Input()
  turma: any;

  /**
   * 
   */

  @ViewChild(ConsultarCuponsDescontoComponent)
  consultarCuponsDescontoComponent;


  /**
   *
   */
  @Output()
  onContinue: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  cupomToUpdate: any;

  /**
   *
   */
  cupomToInsert: any;

  /**
 * 
 * @param dialog 
 * @param activatedRoute 
 * @param snackBar 
 */
  constructor(public dialog: MatDialog, public activatedRoute: ActivatedRoute, public snackBar: MatSnackBar)
  {
  }

  ngOnInit()
  {
    Broker.of("turmaService").promise("listCuponsDescontoByTurmaId", this.turma.id)
      .then((result) =>
      {
        if (!result.content.length)
        {
          this.initCupomToInsert();
        }
      })
      .catch((exception) =>
      {
        this.openSnackBar("Não foi possível consultar os cupons desta turma");
        console.log(exception.message);
      });
  }

  public listCuponsDescontoByTurmaId(): void
  {
    this.consultarCuponsDescontoComponent.listCuponsDescontoByTurmaId();
  }

  /**
   *
   */
  public continue(): void
  {
    this.onContinue.emit();
  }

  /**
   *
   */
  public alterarCupom(cupomDesconto: any): void
  {
    this.cupomToUpdate = cupomDesconto;
  }

  /**
   *
   */
  public cupomSaved(): void
  {
    this.cupomToUpdate = null;
  }

  /**
   *
   */
  public initCupomToInsert(): void
  {
    this.cupomToInsert = {
      turma: this.turma,
      dataInicio: null,
      dataTermino: null,
    }
  }

  /**
   *
   */
  public initCupomToUpdate(cupom: any)
  {
    if (!this.cupomToInsert && !this.cupomToUpdate)
    {
      this.cupomToUpdate = cupom;
      this.cupomToUpdate.turma = this.turma; //Turma com o bind do componente pai
    }
    else
    {
      this.openSnackBar("Antes você deve finalizar ou cancelar o formulário atual.");
    }
  }

  /**
   *
   */
  public resetCupomToInsert(): void
  {
    this.cupomToInsert = null;
    this.consultarCuponsDescontoComponent.listCuponsDescontoByTurmaId();
  }

  /**
   *
   */
  public resetCupomToUpdate(cupom: any): void
  {
    this.cupomToUpdate = null;
    this.consultarCuponsDescontoComponent.listCuponsDescontoByTurmaId();
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
 * @param aula
 */
  public removeCupom(cupom: any)
  {
    if (!this.cupomToInsert && !this.cupomToUpdate)
    {
      Broker.of("turmaService").promise("removeCupomDesconto", cupom.id)
        .then(() =>
        {
          this.openSnackBar('Cupom removido com sucesso');
          this.listCuponsDescontoByTurmaId();
        })
        .catch((exception) =>
        {
          this.openSnackBar('Não foi possível remover o cupom');
          console.log(exception);
        })
    }
    else
    {
      this.openSnackBar("Antes você deve finalizar ou cancelar o formulário atual.");
    }
  }

}
