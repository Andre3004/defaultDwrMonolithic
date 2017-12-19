import { Component, OnInit } from '@angular/core';
import { Broker } from 'eits-ngx';
import { AuthenticatedUserService } from '../../../../controls/authenticated-user/authenticated-user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { IPageChangeEvent } from '@covalent/core';
import { TermosUsoDialogComponent } from '../../../../controls/termos-uso/termos-uso-dialog/termos-uso-dialog.component';

@Component({
  selector: 'consultar-meus-cursos',
  templateUrl: './consultar-meus-cursos.component.html',
  styleUrls: ['./consultar-meus-cursos.component.css']
})
export class ConsultarMeusCursosComponent implements OnInit
{


  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  public filters: String[] = [];

  /**
   *
   */
  public isOrganizador: boolean = true;

  /**
   *
   */
  public cursos: any[] = [];

  /**
   *
   */
  public cursosAprovados: any[] = [];

  /**
   *
   */
  public cursosPendentes: any[] = [];

  /**
   *
   */
  public cursosRascunho: any[] = [];

  /**
   *
   */
  public instrutor: any;

  /**
   *
   */
  public showPesquisaAvancada: boolean;

  /**
   *
   */
  public dataFilter: Date;

  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/

  /**
   *
   * @param authenticatedUserService
   * @param router
   * @param snackBar
   */
  constructor(public authenticatedUserService: AuthenticatedUserService, public router: Router, public snackBar: MatSnackBar, public activatedRoute: ActivatedRoute, public dialog: MatDialog)
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
    this.getAuthenticatedUser();
  }

  /**
   *
   */
  public insertCurso()
  {
    if (!this.instrutor.termosUsoAccepted)
    {
      let dialogRef = this.dialog.open(TermosUsoDialogComponent);

      dialogRef.afterClosed().subscribe(result =>
      {
        if(result)
        {
          Broker.of("usuarioService").promise("acceptTermosUso")
            .then((result) =>
            {
              this.instrutor.termosUsoAccepted = result.termosUsoAccepted;
              this.authenticatedUserService.setAuthenticatedUser(this.instrutor);
              this.router.navigate(['inserir'], {relativeTo: this.activatedRoute});
            })
        }
      });
    }
    else
    {
      this.router.navigate(['inserir'], {relativeTo: this.activatedRoute});
    }
  }

  /**
   * Chamado ao alterar algum filtro
   *
   */
  public onChangeFilters()
  {
    let filters = this.filters && this.filters.length ? this.filters.join() : null;

    /**
     * Seta as horas como 0, pois a query filtra pelas horas também TODO centralizar, também existe no back-end
     */
    if (this.dataFilter)
    {
      this.dataFilter.setHours(0);
      this.dataFilter.setMinutes(0);
    }

    Broker.of("usuarioService").promise("listCursosInstrutorByFilters", filters, null, this.dataFilter, this.instrutor.id, !this.isOrganizador, null)
      .then((page) =>
      {
        if (page)
        {
          this.cursos = page.content;
          this.mapCursosForStatus();
        }
      })
  }

  /**
   *
   */
  public getAuthenticatedUser(): void
  {
    this.authenticatedUserService.getPromiseAuthenticatedUser()
      .then((authenticatedUser) =>
      {
        if (authenticatedUser)
        {
          if (authenticatedUser.isInstrutor || authenticatedUser.isAdministrador)
          {
            this.instrutor = authenticatedUser;
            this.onChangeFilters();
          }
          else
          {
            this.openSnackBar("Acesso negado! você precisa ser um instrutor.");
            this.router.navigate(["/dashboard/minha-conta"]);
          }
        }
        else
        {
          this.openSnackBar("Você precisa estar logado!");
          this.router.navigate([""]);
        }
      })
      .catch((exception) =>
      {
        this.openSnackBar("Você precisa estar logado!");
        this.router.navigate([""]);
      })
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
  public hidePesquisaAvancada()
  {
    this.showPesquisaAvancada = false;

    this.dataFilter = null;

    this.onChangeFilters();
  }

  /**
   *
   */
  public mapCursosForStatus()
  {
    this.cursosAprovados = this.cursos.filter(curso => curso.aprovado);
    this.cursosPendentes = this.cursos.filter(curso => curso.pendente);
    this.cursosRascunho = this.cursos.filter(curso => curso.rascunho);
  }
}
