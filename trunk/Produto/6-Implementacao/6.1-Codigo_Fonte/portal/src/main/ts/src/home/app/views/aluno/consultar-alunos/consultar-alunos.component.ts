import { Component, OnInit } from "@angular/core";

import { Broker } from "eits-ngx";
import { Router } from "@angular/router";
import { MatSnackBar, MatDialog } from "@angular/material";
import { ConsultarCursosDialogComponent } from "./consultar-cursos-dialog/consultar-cursos-dialog.component";
import { BloquearAlunosComponent } from "../bloquear-alunos/bloquear-alunos.component";

@Component({
  selector: 'consultar-alunos',
  templateUrl: './consultar-alunos.component.html',
  styleUrls: ['./consultar-alunos.component.css']
})
export class ConsultarAlunosComponent implements OnInit
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
  public alunos: any[] = [];

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
    areaInteresse: []
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
   */
  public page: any;

  /**
   *
   */
  public cidadesFiltro: String[] = [];

  /**
   *
   */
  public selectedAlunos: any[] = [];

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
    this.listUsuariosByFilters(null, null, this.pageable, null, this.filtro.isBloqueado, this.filtro.areaInteresse);
  }

  /**
   * Opção "VER MAIS"
   *
   */
  public showMore()
  {
    this.pageable.page += 1;
    this.listAlunos();
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

    let areaInteresse = this.filtro.areaInteresse && this.filtro.areaInteresse.length ? this.filtro.areaInteresse.join() : null;

    Broker.of("usuarioService").promise("listUsuariosByFilters", filter, cidadesFiltro, this.filtro.isEmpresa, this.filtro.isBloqueado, areaInteresse, null, this.pageable)
      .then((result) =>
      {
        result.content.forEach((aluno: any) =>
        {
          aluno = this.getFoto(aluno);
        });

        // Novo array de alunos mapeado
        this.alunos = result.content;
        this.page = result;
      })
  }

  /**
   * Consulta de alunos com filtros do model
   *
   */
  public listAlunos()
  {
    this.listUsuariosByFilters(this.filter, this.cidadesFiltro, this.pageable, this.filtro.isEmpresa, this.filtro.isBloqueado, this.filtro.areaInteresse);
  }


  /**
   * Consulta de alunos
   *
   */
  public listUsuariosByFilters(filter: String[], cidadesFiltro: String[], pageable: any, isEmpresa: Boolean, isBloqueado: Boolean, areaInteresse: String[])
  {

    let cidadesFiltroString = cidadesFiltro && cidadesFiltro.length ? cidadesFiltro.join() : null;

    let filterString = filter && filter.length ? filter.join() : null;

    let areaInteresseString = areaInteresse && areaInteresse.length ? areaInteresse : null;

    Broker.of("usuarioService").promise("listUsuariosByFilters", filterString, cidadesFiltroString, isEmpresa, isBloqueado, areaInteresseString, null, pageable)
      .then((result) =>
      {
        result.content.forEach((aluno: any) =>
        {
          aluno = this.getFoto(aluno);
        });
        // Novo array de alunos mapeado
        this.alunos = this.alunos.concat(result.content);
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
  public getFoto(aluno)
  {
    Broker.of("usuarioService").promise("findUsuarioFotoByUsuarioId", aluno.id)
      .then((result) =>
      {
        aluno.foto = result;
      });
  }

  /**
   *
   */
  public hidePesquisaAvancada()
  {
    this.showPesquisaAvancada = false;

    //Filtros
    this.filtro.areaInteresse = [];
    this.filtro.isEmpresa = null;
    this.filtro.isBloqueado = false;

    this.onChangeFilters();

  }

  /**
   *
   * @param aluno
   */
  public goToVisualizarAluno(aluno): void
  {
    this.router.navigate(["/dashboard/alunos/" + aluno.id]);
  }

  /**
   *
   * @param aluno
   * @param isChecked
   */
  public showCheckBox(aluno: any, isChecked: boolean)
  {
    aluno.showCheckBox = (aluno.selected) ? true : isChecked;
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
   * @param aluno
   */
  public toggleSelectAluno(aluno: any)
  {
    aluno.selected = !aluno.selected;
    this.updateSelectedAlunos(aluno);
  }


  /**
    *
    * @param aluno
    */
  public updateSelectedAlunos(aluno: any)
  {
    if (aluno.selected)
    {
      this.selectedAlunos.push(aluno);
    }
    else
    {
      let indexAluno = this.selectedAlunos.indexOf(aluno);
      if (indexAluno > -1)
      {
        this.selectedAlunos.splice(indexAluno, 1);
      }
    }
  }

  /**
   *
   * @param alunos
   */
  public recomendarCursoParaAlunos(alunos: any[])
  {
    let dialogRef = this.dialog.open(ConsultarCursosDialogComponent);

    dialogRef.afterClosed().subscribe(
      (curso) =>
      {
        if (curso)
        {
          Broker.of("usuarioService").promise("recomendarCursoParaAlunos", alunos, curso)
            .then((emailsFailed) =>
            {
              if (emailsFailed === 0)
              {
                this.openSnackBar("Recomendações realizadas com sucesso!");
              }
              else if (emailsFailed === 1 && this.selectedAlunos.length != 1)
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
              this.resetSelectedAlunos();
            }).catch((exception) =>
            {
              console.log(exception);
            });
        }
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
  public resetSelectedAlunos()
  {
    this.alunos.forEach(
      aluno =>
      {
        if (aluno.selected)
        {
          aluno.selected = false;
          this.showCheckBox(aluno, false);
        }
      }
    );
    this.selectedAlunos = [];
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
  public desbloquear(alunos: any[])
  {
    let alunoIds = alunos.map((aluno) => aluno.id);

    Broker.of("usuarioService").promise("desbloquearAlunos", alunoIds)
      .then((result) =>
      {
        this.openSnackBar("Desbloqueio de aluno(s) realizado com sucesso!");
        this.onChangeFilters();
      })
      .catch((exception) =>
      {
        this.openSnackBar(exception.message);
      })
  }

  /**
   * 
   */
  public bloquear(alunos: any[])
  {
    let dialogRef = this.dialog.open(BloquearAlunosComponent, {
      data: alunos,
      width: "600px"
    })

    dialogRef.afterClosed().subscribe(usuario =>
    {
      this.onChangeFilters();
    });
  }
}

