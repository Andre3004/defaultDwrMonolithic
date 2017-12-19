import { Component, OnInit } from '@angular/core';
import { Broker } from "eits-ngx";
import { MatDialogRef } from "@angular/material";
import { IPageChangeEvent } from "@covalent/core";

@Component({
  selector: 'home-consultar-cursos-dialog',
  templateUrl: './consultar-cursos-dialog.component.html',
  styleUrls: ['./consultar-cursos-dialog.component.css']
})
export class ConsultarCursosDialogComponent implements OnInit
{
  /**
   *
   * @type {Array}
   */
  filters: string[] = [];

  /**
   *
   */
  cursos: any[];

  /**
   *
   */
  public page;

  /**
   *
   */
  public pageable: any =
  {
    size: 5,
    page: 0,
    sort: null
  };
  /*-------------------------------------------------------------------
  *                           CONSTRUCTORS
  *-------------------------------------------------------------------*/
  /**
   *
   * @param dialogRef
   */
  constructor(public dialogRef: MatDialogRef<ConsultarCursosDialogComponent>) { }


  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/

  /**
   *
   */
  ngOnInit()
  {
    this.listCursoByFilters(this.filters, this.pageable);
  }

  /**
  *
  */
  public listCursoByFilters(filters, pageable): void
  {
    Broker.of("cursoService").promise("listCursosAprovadosByFilters", (filters && filters.length == 0)? null: filters.join(), null, null, pageable)
      .then((result) =>
      {
        this.page = result;
        this.cursos = result.content;
        this.cursos.forEach(
          curso =>
          {
            this.findCursoImagem(curso);
          });
      })
      .catch((message) =>
      {
        console.log(message);
      });
  }

  /**
   *
   * @param curso
   */
  public findCursoImagem(curso: any): void
  {
    Broker.of("cursoService").promise("findCursoImagemByCursoId", curso.id)
      .then((result) =>
      {
        curso.imagem = result;
      });
  }

  /**
   *
   * @param curso
   */
  public selectCurso(curso: any): void
  {
    this.dialogRef.close(curso);
  }

  /**
   *
   * @param event
   */
  public changePage(event: IPageChangeEvent): void
  {
    this.pageable.page = (event.page - 1);
    this.pageable.size = (event.pageSize);
    this.listCursoByFilters(this.filters, this.pageable);
  }
}
