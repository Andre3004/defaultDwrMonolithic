import { DadosMatriculaComponent } from './dados-matricula/dados-matricula.component';
import { MatSnackBar } from "@angular/material";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Broker } from "eits-ngx";
import { LoadingMode, LoadingType, StepState, TdLoadingService } from "@covalent/core";
import { ReservaVagasComponent } from "./reserva-vagas/reserva-vagas.component";
import { DadosPagamentoComponent } from './dados-pagamento/dados-pagamento.component';
import { TdStepComponent } from '@covalent/core/steps/step.component';
/**
 *
 */
@Component({
  selector: 'realizar-matriculas',
  templateUrl: './realizar-matriculas.component.html',
  styleUrls: ['./realizar-matriculas.component.css']
})
export class RealizarMatriculasComponent implements OnInit
{

  /*-------------------------------------------------------------------
    *                           ATTRIBUTES
    *-------------------------------------------------------------------*/

  /**
   *
   */
  @ViewChild(DadosMatriculaComponent)
  dadosMatriculaComponent: DadosMatriculaComponent;

  /**
   *
   */
  @ViewChild(DadosPagamentoComponent)
  dadosPagamentoComponent: DadosPagamentoComponent;

  /**
   * Estado do passo 1
   */
  reservaVagasState: StepState;

  /**
   * Estado do passo 2
   */
  matriculasState: StepState;

  /**
   * Passo 2 desativado
   */
  isMatriculasDisabled: Boolean;

  /**
   * Passo 3 desativado
   */
  isPagamentoDisabled: Boolean;

  /**
   *
   */
  turma: any;

  /**
   *
   */
  curso: any;

  /**
   *
   */
  compra: any;

  /**
   *
   */
  isBoletoDisabled: boolean;

  /**
   *
   */
  authenticatedUser: any;

  /*-------------------------------------------------------------------
  *                           CONSTRUCTORS
  *-------------------------------------------------------------------*/

  /**
   *
   */
  constructor(public activatedRoute: ActivatedRoute, public router: Router, public snackBar: MatSnackBar, public loadingService: TdLoadingService)
  {
    this.loadingService.create({
      name: 'loadingPagamento',
      mode: LoadingMode.Indeterminate,
      type: LoadingType.Circular,
      color: 'accent',
    });
  }

  /*-------------------------------------------------------------------
  *                           BEHAVIORS
  *-------------------------------------------------------------------*/
  /**
   *
   */
  ngOnInit(): void
  {
    let pagamento: any = {};
    let responsavel: any = { isEmpresa: false };

    //inicializa compra com valores default
    this.compra = {
      responsavel: responsavel,
      pagamento: pagamento
    };

    //Vá para o passso 1
    this.goToReservaVagasStep();
    this.findTurmaById(+this.activatedRoute.snapshot.params['id-turma']);
    this.compra.cupomDesconto = null;
  }

  /**
   *
   * @param turmaId
   */
  public findTurmaById(turmaId: number): void
  {
    Broker.of("turmaService").promise("findTurmaById", turmaId)
      .then((result) =>
      {
        if (result)
        {
          this.turma = result;
          this.findPrimeiraEUltimaAulaByTurmaId(this.turma.id);
          this.findCursoById(this.turma.curso.id);
        }
        else
        {
          this.openSnackBar("Turma não encontrada!");
          this.router.navigate([""]);
        }
      })
      .catch((message) =>
      {
        console.log(message);
      });
  }

  /**
   *
   * @param cursoId
   */
  public findCursoById(cursoId: number): any
  {
    Broker.of("cursoService").promise("findCursoById", cursoId)
      .then((result) =>
      {
        if (result)
        {
          this.curso = result;
          this.listCursoAreaConhecimentoByCursoIdWithoutParent(this.curso.id, null);
          this.findCursoImagemByCursoId(this.curso.id);
        }
        else
        {
          this.openSnackBar("Curso não encontrado!");
          this.router.navigate([""]);
        }
      })
      .catch((message) =>
      {
        console.log(message);
      });
  }

  /**
   *
   * @param cursoId
   * @param page
   */
  public listCursoAreaConhecimentoByCursoIdWithoutParent(cursoId, page: any)
  {
    Broker.of("cursoService").promise("listCursoAreaConhecimentoByCursoIdWithoutParent", cursoId, page)
      .then((result) =>
      {
        if (result.content)
          this.curso.areaConhecimento = result.content[0].areaConhecimento;
      }).catch((exception) =>
      {
        console.log(exception.message)
      });
  }

  /**
   *
   * @param cursoId
   */
  public findCursoImagemByCursoId(cursoId: number): any
  {
    Broker.of("cursoService").promise("findCursoImagemByCursoId", cursoId)
      .then((result) =>
      {
        this.curso.imagem = result;
      })
      .catch((message) =>
      {
        console.log(message);
      });
  }

  /**
   *
   * @param turmaId
   */
  public findPrimeiraEUltimaAulaByTurmaId(turmaId: number): any
  {
    Broker.of("turmaService").promise("findPrimeiraEUltimaAulaByTurmaId", turmaId)
      .then((result) =>
      {
        this.turma.aulas = result;

        this.verifyDataLimiteInscricoes(this.turma.aulas[0].inicio);
      })
      .catch((message) =>
      {
        console.log(message);
      });
  }
  /**
   * Passo 1
   */
  goToReservaVagasStep(): void
  {
    this.setStepsStates(StepState.None, StepState.None);
    this.setStepsDisabled(true, true);
  }
  /**
   * Passo 2
   */
  goToMatriculasStep(): void
  {
    if (this.reservaVagasState != StepState.Complete)
    {
      this.initiateDadosMatricula();
    }
    this.setStepsStates(StepState.Complete, StepState.None);
    this.setStepsDisabled(false, true);
  }

  /**
   *
   */
  initiateDadosMatricula()
  {
    this.dadosMatriculaComponent.initDadosMatricula();
  }

  /**
   *
   */
  resetDadosMatricula(event)
  {
    this.compra.matriculas = [];
    this.turma.lotes.forEach(
      lote =>
      {
        lote.matriculas = [];
      }
    );
    this.compra.valor = event.valor;
    this.compra.vagasOcupadas = event.vagasOcupadas;
  }

  /**
   * Passo 3
   */
  goToPagamentoStep(): void
  {
    this.dadosPagamentoComponent.getParcelas(this.compra.valor);
    this.setStepsStates(StepState.Complete, StepState.Complete);
    this.setStepsDisabled(false, false);
  }

  /**
   * Seta o estado dos passos 1 e 2
   * @param reservaVagasState
   * @param dadosMatriculaState
   */
  setStepsStates(reservaVagasState, matriculasState): void
  {
    this.reservaVagasState = reservaVagasState;
    this.matriculasState = matriculasState;
  }

  /**
   * Seta o parametro desativado dos passos 2 e 3
   * @param isDadosMatriculaDisabled
   * @param isDadosPagamentoDisabled
   * @param isMatriculasDisabled
   * @param isPagamentoDisabled
   */
  setStepsDisabled(isMatriculasDisabled, isPagamentoDisabled): void
  {
    this.isPagamentoDisabled = isPagamentoDisabled;
    this.isMatriculasDisabled = isMatriculasDisabled;
  }

  /**
   *
   */
  realizarMatriculas(): void
  {
    this.prepareCompra();
    this.insertCompra();
  }

  /**
   *
   */
  prepareCompra()
  {
    if (this.compra.valor != 0 && (this.compra.cupomDesconto && this.compra.valor - this.compra.valor * this.compra.cupomDesconto.valor / 100 != 0))
    {
      if (this.compra.pagamento.numeroCartao)
      {
        this.compra.pagamento.numeroCartao = this.getNumbers(this.compra.pagamento.numeroCartao);
      }

      if (this.compra.pagamento.cpfTitularCartao)
      {
        this.compra.pagamento.cpfTitularCartao = this.getNumbers(this.compra.pagamento.cpfTitularCartao);
      }

      if (this.compra.pagamento.endereco.cep)
      {
        this.compra.pagamento.endereco.cep = this.getNumbers(this.compra.pagamento.endereco.cep);
      }
    }
    else
    {
      this.compra.pagamento = null;
    }
    if (!this.compra.responsavel.isEstrangeiro)
    {
      this.compra.responsavel.documento = this.getNumbers(this.compra.responsavel.documento);
    }

    if (this.compra.responsavel.isEmpresa && this.compra.responsavel.registroGeral != null)
    {
      this.compra.responsavel.registroGeral = null;
    }
  }

  /**
   *
   */
  getNumbers(str: string)
  {
    return str.replace(/[^0-9]/g, '');// Sobrescreve tudo o que nao é número com nada
  }

  /**
   *
   * @param compra
   */
  insertCompra(): void
  {
    this.loadingService.register("loadingPagamento");
    Broker.of("compraService").promise("insertCompra", this.compra)
      .then((result) =>
      {
        if (result)
        {
          this.compra = result;
          if (this.compra.pagamento)
          {
            Broker.of("compraService").promise("updatePagamentoFromGatewayPayment", this.compra.pagamento.id)
              .then((result) =>
              {
                this.loadingService.resolve("loadingPagamento");
                if (result)
                {
                  this.compra.pagamento = result;
                  this.openSnackBar("Reserva de matrículas realizada com sucesso!");
                  this.router.navigate(["compra", this.compra.id], { relativeTo: this.activatedRoute });
                }
              })
              .catch((error) =>
              {
                this.loadingService.resolve("loadingPagamento");
                this.openSnackBar(error.message);
              });
          }
          else
          {
            this.loadingService.resolve("loadingPagamento");
            this.openSnackBar("Reserva de matrículas realizada com sucesso!");
            this.router.navigate(["compra", this.compra.id], { relativeTo: this.activatedRoute });
          }
        }
        else
        {
          this.loadingService.resolve("loadingPagamento");
        }
      })
      .catch((error) =>
      {
        this.loadingService.resolve("loadingPagamento");
        this.openSnackBar(error.message);
      });
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

  /**
   *
   * @param dataInicio
   */
  public verifyDataLimiteInscricoes(dataInicio: Date)
  {
    let today = new Date();

    let dataLimiteInscricoes = new Date(dataInicio);
    dataLimiteInscricoes.setDate(dataInicio.getDate() - 1);

    if (today <= dataLimiteInscricoes) //Período de matrículas ainda válido
    {
      let dataLimiteBoleto = new Date(dataInicio);
      dataLimiteBoleto.setDate(dataInicio.getDate() - 5);

      this.isBoletoDisabled = today >= dataLimiteBoleto;

      this.compra.pagamento.formaPagamento = this.isBoletoDisabled ? "CARTAO" : "BOLETO";
    }
    else
    {
      this.openSnackBar("Matrículas encerradas");
      this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
    }
  }

  /**
   * 
   */
  public dadosMatriculaCompleted(pagamentoStep: TdStepComponent)
  {
    if (this.compra.cupomDesconto && (this.compra.valor - this.compra.valor * this.compra.cupomDesconto.valor / 100 == 0 || this.compra.valor == 0))
    {
      this.realizarMatriculas();    
    }
    else
    {
      this.goToPagamentoStep();
      pagamentoStep.disabled = false;
      pagamentoStep.open();
    }
  }

}
