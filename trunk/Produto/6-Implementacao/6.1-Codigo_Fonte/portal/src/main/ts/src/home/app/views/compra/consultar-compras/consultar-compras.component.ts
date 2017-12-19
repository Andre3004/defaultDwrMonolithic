import { Component, OnInit } from "@angular/core";

import { Broker } from "eits-ngx";
import { Router } from "@angular/router";
import { MatSnackBar, MatDialog } from "@angular/material";
import {IPageChangeEvent} from "@covalent/core";

@Component({
  selector: 'consultar-compras',
  templateUrl: 'consultar-compras.component.html',
  styleUrls: ['consultar-compras.component.css']
})
export class ConsultarComprasComponent implements OnInit
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
   * @type {[number , number , number , number , number , number , number , number , number , number , number , number , number , number , number , number , number , number , number , number]}
   */
  public pageSizes: number[] = [20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1];

  /**
   *
   */
  public compras: any[] = [];

  /**
   *
   * @type {{isResponsavel: boolean; registered: boolean; dataInicioAulas: any; dataCompra: any}}
   */
  public filtro/*: any */= {
    dataCompra: null
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
   * @type {{size: number; page: number; sort: {orders: [{direction: string; property: string; nullHandlingHint: string}]}}}
   */
  public pageable = {//PageRequest
    size: 20,
    page: 0,
    sort: {
      orders: [{
        direction: "DESC",
        property: "created",
        nullHandlingHint: "NATIVE"
      }]
    }
  };

  /**
   *
   */
  public cidadesFiltro: String[] = [];

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
    this.listComprasByFilters(null, null, this.filtro.dataCompra, null, null, null, this.pageable);
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
    let cidadesFiltro = this.cidadesFiltro && this.cidadesFiltro.length ? this.cidadesFiltro.join() : null;

    let filter = this.filter && this.filter.length ? this.filter.join() : null;

    Broker.of("compraService").promise("listComprasByFilters", filter, cidadesFiltro, null, this.filtro.dataCompra, null, null, null, this.pageable)
      .then((result) =>
      {
        result.content.forEach((compra: any) =>
        {
          compra = this.getFoto(compra.matriculas[0].lote.turma.curso);
        });
        // Novo array de alunos mapeado
        this.compras = result.content;
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
    this.listComprasByFilters(this.filter, this.cidadesFiltro, null, this.filtro.dataCompra, null, null, this.pageable);
  }


  /**
   * Consulta de alunos
   *
   */
  public listComprasByFilters(filter: String[], cidadesFiltro: String[], dataInicioAulas, dataCompra, isResponsavel: Boolean, registered: Boolean, pageable: any)
  {
    let cidadesFiltroString = cidadesFiltro && cidadesFiltro.length ? cidadesFiltro.join() : null;

    let filterString = filter && filter.length ? filter.join() : null;

    Broker.of("compraService").promise("listComprasByFilters", filterString, cidadesFiltroString, dataInicioAulas, dataCompra, isResponsavel, registered, null, pageable)
      .then((result) =>
      {
        result.content.forEach((compra: any) =>
        {
          compra.matriculas[0].lote.turma.curso.imagem = this.getFoto(compra.matriculas[0].lote.turma.curso);
        });
        // Novo array de alunos mapeado
        this.compras = this.compras.concat(result.content);
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
   * @param event
   */
  public changePage(event: IPageChangeEvent): void
  {
    this.pageable.page = (event.page - 1);
    this.pageable.size = (event.pageSize);

    this.onChangeFilters();
  }

}

