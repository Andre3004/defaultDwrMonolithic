import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Input } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Broker } from 'eits-ngx';

@Component({
  selector: 'consultar-cupons-desconto',
  templateUrl: './consultar-cupons-desconto.component.html',
  styleUrls: ['./consultar-cupons-desconto.component.css']
})
export class ConsultarCuponsDescontoComponent implements OnInit
{

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
  @Input()
  backgroundColor: string = "bgc-blue-grey-50";

  /**
   *
   */
  @Output()
  onAlterarCupom: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  @Output()
  onRemoveCupom: EventEmitter<any> = new EventEmitter();

  /**
   * 
   */
  cuponsDesconto: any[];

  /**
   * 
   */
  public pageable = {
    size: 100,
    page: 0,
    sort: {
      orders: [{
        direction: "ASC",
        property: "dataInicio",
        nullHandlingHint: "NATIVE"
      }]
    }
  }

  constructor(public dialog: MatDialog, public activatedRoute: ActivatedRoute, public router: Router, public snackBar: MatSnackBar)
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
    this.listCuponsDescontoByTurmaId();
  }

  public listCuponsDescontoByTurmaId()
  {
    Broker.of("turmaService").promise("listCuponsDescontoByTurmaId", this.turma.id, this.pageable)
      .then((result) =>
      {
        this.cuponsDesconto = result.content;
        this.turma.cuponsDesconto = this.cuponsDesconto;
      })
      .catch((exception) =>
      {
        this.openSnackBar("Não foi possível consultar os cupons de desconto desta turma");
        console.log(exception.message);
      });
  }

  /**
   *
   * @param aula
   */
  alterarCupom(cupom)
  {
    this.onAlterarCupom.emit(cupom);
  }

  /**
   *
   * @param aula
   */
  public removeCupom(cupom: any)
  {
    this.onRemoveCupom.emit(cupom);
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