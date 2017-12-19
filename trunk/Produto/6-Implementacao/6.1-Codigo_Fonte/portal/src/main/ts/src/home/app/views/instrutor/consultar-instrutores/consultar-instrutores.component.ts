import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { Component, OnInit } from '@angular/core';

import { Broker } from "eits-ngx";
import { RecomendarOportunidadeDialogComponent } from './../recomendar-oportunidade-dialog/recomendar-oportunidade-dialog.component';

@Component({
  selector: 'home-consultar-instrutores',
  templateUrl: './consultar-instrutores.component.html',
  styleUrls: ['./consultar-instrutores.component.scss']
})
export class ConsultarInstrutoresComponent implements OnInit
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
  public instrutores: any[] = [];

  /**
   *
   */
  public showPesquisaAvancada: Boolean = false;

  /**
   * Filtros da consulta
   */
  public filtro: any = {
    isEmpresa: null,
    isBloqueado: false,
    instrutores: true,
    areaAtuacao: []
  };

  /**
   *
   */
  public pageable = {//PageRequest
    size: 20,
    page: 0,
    sort: {
      orders: [{
        direction: "DESC",
        property: "avaliacao",
        nullHandlingHint: "NATIVE"
      }]
    }
  };

  /**
   *
   */
  public page: any;

  /**
   *
   */
  public cidadesFiltro: String[] = [];

  /**
   *
   */
  public selectedInstrutores: any[] = [];

  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/

  /**
   *
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
    this.listInstrutores();
  }

  /**
   * Opção "VER MAIS"
   *
   */
  public showMore()
  {
    this.pageable.page += 1;
    this.listInstrutores();
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

    let areaAtuacao = this.filtro.areaAtuacao && this.filtro.areaAtuacao.length ? this.filtro.areaAtuacao.join() : null;

    Broker.of("usuarioService").promise("listUsuariosByFilters", filter, cidadesFiltro, this.filtro.isEmpresa, this.filtro.isBloqueado, this.filtro.instrutores, null, areaAtuacao, this.pageable)
      .then((result) =>
      {
        result.content.forEach((instrutor: any) =>
        {
          instrutor = this.getFoto(instrutor);
        });
        // Novo array de instrutores mapeado
        this.instrutores = result.content;
        this.page = result;
      })
  }

  /**
   * Consulta de instrutores com filtros do model
   *
   */
  public listInstrutores()
  {
    this.listUsuariosByFilters(this.filter, this.cidadesFiltro, this.filtro.areaAtuacao);
  }


  /**
   * Consulta de instrutores
   *
   */
  public listUsuariosByFilters(filter: String[], cidadesFiltro: String[], areaAtuacao: String[])
  {

    let cidadesFiltroString = cidadesFiltro && cidadesFiltro.length ? cidadesFiltro.join() : null;

    let filterString = filter && filter.length ? filter.join() : null;

    let areaAtuacaoString = areaAtuacao && areaAtuacao.length ? areaAtuacao : null;

    Broker.of("usuarioService").promise("listUsuariosByFilters", filterString, cidadesFiltroString, this.filtro.isEmpresa, this.filtro.isBloqueado,  this.filtro.instrutores, null, areaAtuacaoString, this.pageable)
      .then((result) =>
      {
        result.content.forEach((instrutor: any) =>
        {
          instrutor = this.getFoto(instrutor);
        });
        // Novo array de instrutores mapeado
        this.instrutores = this.instrutores.concat(result.content);
        this.page = result;
      })
      .catch((exception) =>
      {

      });
  }

  public recomendarOportunidade(instrutores: any[])
  {
    let dialogRef = this.dialog.open(RecomendarOportunidadeDialogComponent);

    dialogRef.afterClosed().subscribe(
      (result) =>
      {
        if (result)
        {
          Broker.of("usuarioService").promise("recomendarOportunidadeCurso", result.areasConhecimento, instrutores, result.descricao)
            .then((emailsFailed) =>
            {
              if (emailsFailed === 0)
              {
                this.openSnackBar("Recomendações realizadas com sucesso!");
              }
              else if (emailsFailed === 1 && this.selectedInstrutores.length != 1)
              {
                this.openSnackBar("Um e-mail falhou ao ser enviado");
              }
              else if (emailsFailed > 1)
              {
                this.openSnackBar(emailsFailed + " e-mails falharam ao ser enviados");
              }
              else
              {
                this.openSnackBar("Recomendação falhou");
              }

              this.resetSelectedInstrutores();

            });
        }
      });
  }


  /**
   *
   */
  public getFoto(instrutor)
  {
    Broker.of("usuarioService").promise("findUsuarioFotoByUsuarioId", instrutor.id)
      .then((result) =>
      {
        instrutor.foto = result;
      });
  }

  /**
   *
   */
  public hidePesquisaAvancada()
  {
    this.showPesquisaAvancada = false;

    //Filtros
    this.filtro.areaAtuacao = [];
    this.filtro.isEmpresa = null;
    this.filtro.isBloqueado = false;

    this.onChangeFilters();

  }

  /**
   *
   */
  public goToVisualizarInstrutor(instrutor): void
  {
    this.router.navigate(["/dashboard/instrutores/" + instrutor.id]);
  }

  /**
   *
   * @param instrutor
   * @param isChecked
   */
  public showCheckBox(instrutor: any, isChecked: boolean)
  {
    instrutor.showCheckBox = (instrutor.selected) ? true : isChecked;
  }

  /**
   *
   */
  public changePesquisaAvancada()
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
 * @param instrutor
 */
  public toggleSelectInstrutor(instrutor: any)
  {
    instrutor.selected = !instrutor.selected;
    this.updateSelectedInstrutores(instrutor);
  }

  /**
 *
 * @param instrutor
 */
  public updateSelectedInstrutores(instrutor: any)
  {
    if (instrutor.selected)
    {
      this.selectedInstrutores.push(instrutor);
    }
    else
    {
      let indexInstrutor = this.selectedInstrutores.indexOf(instrutor);
      if (indexInstrutor > -1)
      {
        this.selectedInstrutores.splice(indexInstrutor, 1);
      }
    }
  }

  /**
   *
   */
  public resetSelectedInstrutores()
  {
    this.instrutores.forEach(
      instrutor =>
      {
        if (instrutor.selected)
        {
          instrutor.selected = false;
          this.showCheckBox(instrutor, false);
        }
      }
    );
    this.selectedInstrutores = [];
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
