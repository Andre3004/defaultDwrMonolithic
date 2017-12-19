import { MatSnackBar } from '@angular/material';
import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Broker } from 'eits-ngx';
import { AuthenticatedUserService } from '../../../controls/authenticated-user/authenticated-user.service';

@Component({
  selector: 'app-visualizar-compra',
  templateUrl: './visualizar-compra.component.html',
  styleUrls: ['./visualizar-compra.component.css']
})
export class VisualizarCompraComponent implements OnInit, AfterViewInit
{

  /*-------------------------------------------------------------------
 *                           ATTRIBUTES
 *-------------------------------------------------------------------*/
  /**
  *
  */
  compra: any;

  /**
 *
 */
  curso: any;

  /**
   *
   */
  turma: any;

  /**
   *
   */
  showMap: boolean;

  /**
   * 
   */
  lotes: any[] = [];

  /**
   * 
   */
  loteMatriculado: any;

  /**
   * 
   */
  usuario: any;

  /**
   * Se é visualização de matrícula ou de uma compra
   * true se o usuario autenticado não é o resposável pela compra
   */
  isUsuarioResponsavel: boolean = false;

  /**
   *
   *  @type {{PRESENCIAL: string; DISTANCIA: string; SEMIPRESENCIAL: string}}
   */
  tipoTurma = {
    PRESENCIAL: "PRESENCIAL",
    DISTANCIA: "DISTANCIA",
    SEMIPRESENCIAL: "SEMIPRESENCIAL"
  };

  /**
  *
  *  @type {{CARTAO: string; BOLETO: string}}
  */
  formaPagamento = {
    CARTAO: "CARTAO",
    BOLETO: "BOLETO",
  };

  /**
   *
   *  @type {{CARTAO: string; BOLETO: string}}
   */
  statusPagamento = {
    APROVADA: "APROVADA",
    EM_ANALISE: "EM_ANALISE",
    CANCELADA: "CANCELADA",
  };

  /*-------------------------------------------------------------------
 *                           CONSTRUCTORS
 *-------------------------------------------------------------------*/
  /**
   *
   */
  constructor(public activatedRoute: ActivatedRoute, public router: Router, public changeDetectionRef: ChangeDetectorRef, private authenticatedUserService: AuthenticatedUserService, private snackBar: MatSnackBar)
  {
  }
  /*-------------------------------------------------------------------
  *                           BEHAVIORS
  *-------------------------------------------------------------------*/
  /**
   *
   */
  ngOnInit(): void
  {
    Broker.of("compraService").promise("findCompraById", +this.activatedRoute.snapshot.params['id'])
      .then((result) =>
      {
        if(result){

          this.compra = result;
          
          this.turma = this.compra.matriculas[0].lote.turma;
          this.curso = this.compra.matriculas[0].lote.turma.curso;
          
          this.findInstrutoresByTurmaId(this.turma);
          
          this.usuario = this.authenticatedUserService.getObservedAuthenticatedUser();
          this.isUsuarioResponsavel = this.usuario.id == this.compra.responsavel.id;
          
          if (this.isUsuarioResponsavel || this.usuario.isAdministrador)
          {
            this.prepareLotes(this.compra);
            this.prepareMatriculas(this.compra);
            this.findUsuarioFoto(this.compra.responsavel);
          }
          else
          {
            this.findLoteMatriculado();
          }
          
        }
        else
        {
          this.openSnackBar("Não foi possível consultar esta compra ou você não tem permissão para visualizá-la");
          this.router.navigate(["../"], {relativeTo: this.activatedRoute});
        }

      }).catch((exception) =>
      {
        console.log(exception.message)
        this.openSnackBar("Não foi possível consultar esta compra ou você não tem permissão para visualizá-la");
        this.router.navigate(["../"], {relativeTo: this.activatedRoute});
      });

  }
  /**
  *
  */
  ngAfterViewInit()
  {
    this.showMap = true;
    this.changeDetectionRef.detectChanges();
  }

  /**
*
* @param alunoId
*/
  public findUsuarioFoto(usuario: any)
  {
    Broker.of("usuarioService").promise("findUsuarioFotoByUsuarioId", usuario.id)
      .then((result) =>
      {
        usuario.foto = result;
      })
      .catch((exception) =>
      {
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
  findLoteMatriculado()
  {
    Broker.of("compraService").promise("findLoteByAlunoIdAndCompraId", this.usuario.id, this.compra.id)
      .then((result) =>
      {
        if (result)
        {
          this.loteMatriculado = result;
        }
        else
        {
          this.openSnackBar("Você não tem permissão para visualizar essa compra");
          this.router.navigate(["../"], {relativeTo: this.activatedRoute});
        }
      })
      .catch((exception) =>
      {
        this.openSnackBar("Não foi possível consultar esta compra ou você não tem permissão para visualizá-la");
        console.log(exception);
      });
  }

  /**
   *
   * @param compra
   */
  prepareLotes(compra: any)
  {
    if (!compra) return;

    for (let _i = 0; _i < compra.matriculas.length; _i++) 
    {
      if (this.containLote(compra.matriculas[_i].lote.id) == false)
      {
        this.lotes.push(compra.matriculas[_i].lote);
        continue;
      }
    }
  }

  /**
   *
   * @param loteId
   * @returns {boolean}
   */
  containLote(loteId: number): boolean
  {
    for (let _i = 0; _i < this.lotes.length; _i++) 
    {
      if (this.lotes[_i].id === loteId)
      {
        return true;
      }
    }

    return false;
  }


  /**
   *
   * @param compra
   */
  prepareMatriculas(compra: any)
  {
    if (!compra) return;

    for (let _i = 0; _i < compra.matriculas.length; _i++) 
    {
      for (let _j = 0; _j < this.lotes.length; _j++) 
      {
        if (this.lotes[_j].id === compra.matriculas[_i].lote.id)
        {
          if (!this.lotes[_j].matriculas) this.lotes[_j].matriculas = [];
          this.lotes[_j].matriculas.push(compra.matriculas[_i]);
        }
      }
    }
  }
  /**
   *
   * @param turma
   */
  public findInstrutoresByTurmaId(turma)
  {
    Broker.of("usuarioService").promise("findInstrutoresByTurmaId", turma.id, null)
      .then((result) =>
      {
        turma.instrutores = result.content;
        this.findinstrutoresFotoByUsuarioId(turma.instrutores);
      })
      .catch((message) =>
      {
        console.log(message);
      });
  }

  /**
   *
   * @param alunoId
   */
  public findinstrutoresFotoByUsuarioId(instrutores: any)
  {
    instrutores.forEach(
      instrutor =>
      {
        Broker.of("usuarioService").promise("findUsuarioFotoByUsuarioId", instrutor.usuario.id)
          .then((result) =>
          {
            instrutor.usuario.foto = result;
          })
          .catch((exception) =>
          {
            console.log(exception);
          });
      });
  }

  /**
   * 
   * @param statusPagamento 
   */
  public getStatusPagamento(statusPagamento: string)
  {
    if (!statusPagamento) return "APROVADA";
    if (statusPagamento === this.statusPagamento.APROVADA) return "APROVADO";
    if (statusPagamento === this.statusPagamento.EM_ANALISE) return "EM ANÁLISE";
    if (statusPagamento === this.statusPagamento.CANCELADA) return "CANCELADO";
  }

  /**
   * 
   * @param formaPagamento 
   */
  public getFormaPagamento(formaPagamento: string)
  {
    if (formaPagamento === this.formaPagamento.BOLETO) return "Boleto";
    if (formaPagamento === this.formaPagamento.CARTAO) return "Cartão";
    return null;
  }

  /**
   * 
   * @param lote 
   */
  public listMatriculasByLoteIdAndCompraId(lote: any)
  {
    Broker.of("compraService").promise("listMatriculasByLoteIdAndCompraId", lote.id, this.compra.id)
      .then((page) =>
      {
        lote.matriculas = page.content;
      })
      .catch((exception) =>
      {
        console.log(exception);
      });
  }
}
