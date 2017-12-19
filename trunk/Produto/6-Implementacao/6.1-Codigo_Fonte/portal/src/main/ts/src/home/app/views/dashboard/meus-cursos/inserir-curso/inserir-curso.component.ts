import { MatSnackBar } from '@angular/material';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Broker } from 'eits-ngx';
import { StepState } from "@covalent/core";

@Component({
  selector: 'inserir-curso',
  templateUrl: './inserir-curso.component.html',
  styleUrls: ['./inserir-curso.component.css']
})
export class InserirCursoComponent implements OnInit
{

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   * @type {{dadosDeposito: {dadosDepositoIsEmpresa: boolean}; areaAtuacao: {instrutor: {}}; instrutor: {}; turmas: Array}}
   */
  /**
   * 
   */
  fornecedorCertificado = {
    TFC : "TFC",
    ORGANIZADOR: "ORGANIZADOR"
  };

  @Input()
  public curso: any  = {
      dadosDeposito: {
        dadosDepositoIsEmpresa: false
      },
      areaAtuacao: {
        instrutor: {}
      },
      fornecedorCurso: this.fornecedorCertificado.ORGANIZADOR,
      instrutor: {},
      turmas: []
    };
    

  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/

  constructor(public snackBar: MatSnackBar, public router: Router)
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
   * @param curso
   */
  public save(dadosCursoStep: any, dadosDepositoStep: any)
  {
    if (this.validaSteps(dadosCursoStep, dadosDepositoStep))
    {
      let fileTransfer = this.curso.fileTransfer;
      // Não mandar a foto em bytearray para o backend pq quebra em alguns pcs
      this.curso.imagem = null;
      Broker.of("cursoService").promise("insertCurso", this.curso)
        .then((result) =>
        {
          this.curso = result;

          if (fileTransfer)
          {
            this.updateCursoImagem(fileTransfer);
          }
          else
          {
            this.openSnackBar("Novo curso inserido com sucesso");
            this.router.navigate(["/dashboard/meus-cursos/" + result.id + "/curso-inserido"]);
          }
        })
        .catch((exception) =>
        {
          this.openSnackBar(exception.message);
        });
    }
  }

  /**
   *
   * @param dadosCursoStep
   * @param dadosDepositoStep
   * @returns {boolean}
   */
  public validaSteps(dadosCursoStep: any, dadosDepositoStep: any)
  {
    if (dadosCursoStep.state === StepState.Complete)
    {
      return true;
    }
    else
    {
      dadosCursoStep.state = StepState.Required;
      dadosCursoStep.open();
      return false;
    }
  }

  /**
   *
   * @param fileTransfer
   */
  public updateCursoImagem(fileTransfer: any)
  {
    Broker.of("cursoService").promise("updateCursoImagem", fileTransfer, this.curso.id)
      .then((result) =>
      {
        this.openSnackBar("Novo curso inserido com sucesso");
        this.router.navigate(["/dashboard/meus-cursos/" + this.curso.id + "/curso-inserido"]);
      })
      .catch((exception) =>
      {
        this.openSnackBar(exception.message);
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

  /**
   *
   */
  public goToDadosDeposito(dadosCursoStep: any, dadosPagamentoStep: any): void
  {
    dadosCursoStep.state = StepState.Complete;
    dadosPagamentoStep.state = StepState.None;
    dadosPagamentoStep.open();
  }

  /**
   *
   * @param step
   */
  public onStepChange(step: any): void
  {
    step.state = StepState.None;
  }
}
