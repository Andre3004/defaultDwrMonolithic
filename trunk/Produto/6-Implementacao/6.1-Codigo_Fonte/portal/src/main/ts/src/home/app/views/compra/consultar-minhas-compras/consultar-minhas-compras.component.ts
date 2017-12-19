import { Component, OnInit } from "@angular/core";

import { Broker } from "eits-ngx";
import { Router } from "@angular/router";
import { MatSnackBar, MatDialog } from "@angular/material";

@Component({
  selector: 'consultar-minhas-compras',
  templateUrl: 'consultar-minhas-compras.component.html',
  styleUrls: ['consultar-minhas-compras.component.css']
})
export class ConsultarMinhasComprasComponent implements OnInit
{

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  public filter: String[] = [];

  /**
   *
   */
  public compras: any[] = [];

  /**
   *
   */
  public showPesquisaAvancada: Boolean = false;

  /**
   * Filtros da consulta
   */
  public filtro/*: any */= {
    isResponsavel: false,
    registered: false,
    dataInicioAulas: null,
    dataCompra: null
  };

  /**
   *
   */
  public pageable = {//PageRequest
    size: 20,
    page: 0,
    sort: null
  };

  /**
   *
   * @type {{last: boolean}}
   */
  public page: any = {
    last : true
  };

  /**
   *
   */
  public cidadesFiltro: String[] = [];
  /**
   *
   */
  public comprasAprovadas: any[] = [];

  /**
   *
   */
  public comprasEmAnalise: any[] = [];

  /**
   *
   */
  public comprasCanceladas: any[] = [];

  /**
   *
   */
  public comprasTurmaConcluida: any[] = [];

  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/

  /**
   *
   * @param router
   * @param snackBar
   * @param dialog
   */
  constructor(public router: Router, public snackBar: MatSnackBar, public dialog: MatDialog)
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
    this.listMinhasComprasByFilters(null, null, this.filtro.dataInicioAulas, this.filtro.dataCompra, this.filtro.isResponsavel, this.filtro.registered, this.pageable);
  }

  /**
   * Opção "VER MAIS"
   *
   */
  public showMore()
  {
    this.pageable.page += 1;
    this.listCompras();
  }

  /**
   * Chamado ao alterar algum filtro
   *
   */
  public onChangeFilters()
  {
    this.pageable.page = 0;

    let cidadesFiltro = this.cidadesFiltro && this.cidadesFiltro.length ? this.cidadesFiltro.join() : null;

    let filter = this.filter && this.filter.length ? this.filter.join() : null;

    Broker.of("compraService").promise("listMinhasComprasByFilters", filter, cidadesFiltro, this.filtro.dataInicioAulas, this.filtro.dataCompra, this.filtro.isResponsavel, this.filtro.registered, this.pageable)
      .then((result) =>
      {
        result.content.forEach((compra: any) =>
        {
          compra = this.getFoto(compra.matriculas[0].lote.turma.curso);
        });
        // Novo array de alunos mapeado
        this.compras = result.content;
        this.mapComprasForStatus();
        this.page = result;
      })
      .catch((exception) =>
      {
      });
  }

  /**
   * Consulta de alunos com filtros do model
   *
   */
  public listCompras()
  {
    this.listMinhasComprasByFilters(this.filter, this.cidadesFiltro, this.filtro.dataInicioAulas, this.filtro.dataCompra, this.filtro.isResponsavel, this.filtro.registered, this.pageable);
  }


  /**
   * Consulta de alunos
   *
   */
  public listMinhasComprasByFilters(filter: String[], cidadesFiltro: String[], dataInicioAulas, dataCompra, isResponsavel: Boolean, registered: Boolean, pageable: any)
  {
    let cidadesFiltroString = cidadesFiltro && cidadesFiltro.length ? cidadesFiltro.join() : null;

    let filterString = filter && filter.length ? filter.join() : null;

    Broker.of("compraService").promise("listMinhasComprasByFilters", filterString, cidadesFiltroString, dataInicioAulas, dataCompra, isResponsavel, registered, pageable)
      .then((result) =>
      {
        result.content.forEach((compra: any) =>
        {
          compra.matriculas[0].lote.turma.curso.imagem = this.getFoto(compra.matriculas[0].lote.turma.curso);
        });
        // Novo array de alunos mapeado
        this.compras = this.compras.concat(result.content);
        this.mapComprasForStatus();
        this.page = result;
      })
      .catch((exception) =>
      {
      });
  }


  /**
   *
   * @param aluno
   */
  public getFoto(curso)
  {
    Broker.of("cursoService").promise("findCursoImagemByCursoId", curso.id)
      .then((result) =>
      {
        curso.imagem = result;
      });
  }

  /**
   *
   */
  public hidePesquisaAvancada()
  {
    this.showPesquisaAvancada = false;

    //Filtros
    this.filtro.isResponsavel = false;
    this.filtro.registered = false;
    this.filtro.dataInicioAulas = null;
    this.filtro.dataCompra = null;

    this.onChangeFilters();
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
  public toggleShowPesquisaAvancada()
  {
    if (this.showPesquisaAvancada)
    {
      this.hidePesquisaAvancada();
    }
    else
    {
      this.showPesquisaAvancada = true;
    }
  }

  /**
   *
   */
  public mapComprasForStatus()
  {
    this.comprasAprovadas = this.compras.filter(compra => compra.aprovada && !compra.turmaConcluida);
    this.comprasEmAnalise = this.compras.filter(compra => compra.emAnalise);
    this.comprasCanceladas = this.compras.filter(compra => compra.cancelada);
    this.comprasTurmaConcluida = this.compras.filter(compra => compra.turmaConcluida);
  }
}

