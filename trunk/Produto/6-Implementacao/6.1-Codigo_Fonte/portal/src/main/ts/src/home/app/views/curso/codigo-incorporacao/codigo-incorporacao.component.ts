import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { Broker } from 'eits-ngx';

@Component({
  selector: 'codigo-incorporacao',
  templateUrl: './codigo-incorporacao.component.html',
  styleUrls: ['./codigo-incorporacao.component.css']
})
export class CodigoIncorporacaoComponent implements OnInit
{

  /*-------------------------------------------------------------------
  *                           ATTRIBUTES
  *-------------------------------------------------------------------*/

  /**
   *
   */
  curso: any;

  /**
   *
   */
  isCodeCopied: boolean;

  /**
   *
   */
  turmaSelected: any;

  /**
   * host with port and protocol, get from window global variable
   */
  origin: string = window.location.origin;

  /**
  *
  * @type {{PRESENCIAL: string; DISTANCIA: string; SEMIPRESENCIAL: string}}
  */
  tipoTurma = {
    PRESENCIAL: "PRESENCIAL",
    DISTANCIA: "DISTANCIA",
    SEMIPRESENCIAL: "SEMIPRESENCIAL"
  };

  /*-------------------------------------------------------------------
  *                           CONSTRUCTORS
  *-------------------------------------------------------------------*/

  /**
   *
   * @param data
   * @param dialogRef
   * @param snackBar
   */
  constructor( @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<CodigoIncorporacaoComponent>, public snackBar: MatSnackBar)
  {
    this.curso = data;
  }
  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/
  /**
   *
   */
  ngOnInit()
  {
    this.listTurmasDisponiveisByCursoId(this.curso.id);
  }

  /**
  *
  */
  public listTurmasDisponiveisByCursoId(cursoId: number): void
  {
    Broker.of("turmaService").promise("listTurmasDisponiveisByCursoId", cursoId, null)
      .then((result) =>
      {
        this.curso.turmas = result.content;
      })
      .catch((message) =>
      {
        console.log(message);
      });
  }

  /**
   *
   * @param isCodeCopied
   */
  setCodeCopied(turma, isCodeCopied: boolean)
  {
    if (isCodeCopied)
    {
      turma.isCodeCopied = isCodeCopied;
      this.openSnackBar("Código copiado!");
    }
  }

  /**
   *
   * @param message
   */
  openSnackBar(message: string)
  {
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }

  getCodigoIncorporacao(turma: any)
  {
    return '<iframe \nstyle="width:334px;height:469px;border-width:0px" \nsrc="' + this.origin + "/incorporation-code/#/" + turma.id + '">\n</iframe>';
  }

}
