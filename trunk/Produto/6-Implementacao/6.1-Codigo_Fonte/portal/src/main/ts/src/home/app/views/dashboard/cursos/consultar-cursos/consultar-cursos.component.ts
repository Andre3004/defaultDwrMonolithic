import { Component, OnInit } from '@angular/core';
import { Broker } from 'eits-ngx';
import { AuthenticatedUserService } from '../../../../controls/authenticated-user/authenticated-user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { IPageChangeEvent } from '@covalent/core';
import { TermosUsoDialogComponent } from '../../../../controls/termos-uso/termos-uso-dialog/termos-uso-dialog.component';

@Component({
  selector: 'cursos',
  templateUrl: './consultar-cursos.component.html',
  styleUrls: ['./consultar-cursos.component.css']
})
export class ConsultarCursosComponent implements OnInit
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
  public cursos: any[] = [];

  public pageSizes: number[] = [20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1];

  /**
   *
   */
  public statusCursoSelected: string = null;

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
              this.instrutor = result;
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
     * Seta as horas como 0, pois a query filtra pelas horas também TODO verificar melhor forma
     */
    if (this.dataFilter)
    {
      this.dataFilter.setHours(0);
      this.dataFilter.setMinutes(0);
    }

    Broker.of("usuarioService").promise("listAllCursosInstrutorByFilters", filters, this.statusCursoSelected, this.dataFilter, this.pageable)
      .then((page) =>
      {
        if (page)
        {
          this.page = page;
          this.cursos = page.content;
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

    //Filtros
    this.statusCursoSelected = null;
    this.dataFilter = null;

    this.onChangeFilters();
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
