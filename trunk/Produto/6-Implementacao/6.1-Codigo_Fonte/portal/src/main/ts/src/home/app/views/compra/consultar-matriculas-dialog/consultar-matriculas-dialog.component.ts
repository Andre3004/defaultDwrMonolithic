import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from "@angular/material";
import {Broker} from "eits-ngx";

@Component({
  selector: 'consultar-matriculas-dialog',
  templateUrl: './consultar-matriculas-dialog.component.html',
  styleUrls: ['./consultar-matriculas-dialog.component.css']
})
export class ConsultarMatriculasDialogComponent implements OnInit
{

  /**
   *
   * @type {{content: any; pageable: {size: number; page: number; sort: {orders: [{direction: string; property: string; nullHandlingHint: string}]}}}}
   */
  public page = {//PageImpl
    content: null,
    pageable: {//PageRequest
      size: 50,
      page: 0,
      sort: {
        orders: [{
          direction: "ASC",
          property: "created",
          nullHandlingHint: "NATIVE"
        }]
      }
    }
  };

  /**
   *
   */
  turma: any;

  /**
   *
   */
  matriculas: any[];

  /**
   * @type {APROVADA: string, EM_ANALISE: string, CANCELADA: string}
   */
  statusPagamento = {
    APROVADA: "APROVADA",
    EM_ANALISE: "EM_ANALISE",
    CANCELADA: "CANCELADA",
  };

  /**
   * 
   */
  totalLotesAprovados: number;

  /**
   *
   * @param data
   */
  constructor( @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ConsultarMatriculasDialogComponent>, public snackBar: MatSnackBar)
  {
    this.turma = data;
  }

  /**
   *
   */
  ngOnInit()
  {
    this.listMatriculasByTurmaId();
  }

  /**
   *
   */
  public listMatriculasByTurmaId()
  {
    Broker.of("turmaService").promise("listMatriculasByTurmaId", this.turma.id, this.page.pageable)
      .then((result) =>
      {
        if (result && result.content && result.content.length)
        {
          this.matriculas = result.content;

          let precosLotesAprovados = this.matriculas.map(
            (matricula) => (matricula.compra.pagamento && matricula.compra.pagamento.statusPagamento == this.statusPagamento.APROVADA)? matricula.lote.preco : 0
          );
          this.totalLotesAprovados = precosLotesAprovados.reduce(this.getSum);
        }
      })
      .catch((exception) =>
      {
        this.openSnackBar(exception.message);
        console.log(exception);
      });
  }

  /**
   *
   * @param total
   * @param num
   * @returns {any}
   */
  getSum(total, num)
  {
    return total + num;
  }

  /**
   *
   * @param statusPagamento
   */
  public getStatusPagamento(statusPagamento: string): string
  {
    if (!statusPagamento) return "Aprovado";
    if (this.statusPagamento.APROVADA === statusPagamento)
      return "Aprovado";
    if (this.statusPagamento.CANCELADA === statusPagamento)
      return "Cancelado";
    if (this.statusPagamento.EM_ANALISE === statusPagamento)
      return "Em análise";
  }

  /**
   *
   * @param turmaId
   */
  public generateComprasByTurmaId(turmaId)
  {
    Broker.of("turmaService").promise("generateComprasByTurmaId", turmaId)
      .then((result) =>
      {
        window.location.href = result;
      })
      .catch((exception) =>
      {
        this.openSnackBar(exception.message);
        console.log(exception);
      });
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
