import { Component, OnInit, ViewChild } from "@angular/core";
import { Broker } from "eits-ngx";
import { TdChipsComponent } from "@covalent/core";
import { MatDialog } from "@angular/material";
import { SugerirCursoComponent } from "../sugerir-curso/sugerir-curso.component";

/**
 *
 */
@Component({
  selector: 'consultar-cursos-aprovados',
  templateUrl: './consultar-cursos-aprovados.component.html',
  styleUrls: ['./consultar-cursos-aprovados.component.scss']
})

export class ConsultarCursosAprovadosComponent implements OnInit
{
  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  dataFilter: Date;

  /**
  *
  */
  @ViewChild(TdChipsComponent)
  chips: any;


  /**
   *
   * @type {{content: any; pageable: {size: number; page: number; sort: {orders: [{direction: string; property: string; nullHandlingHint: string}]}}}}
   */
  public page = {//PageImpl
    content: null,
    pageable: {//PageRequest
      size: 20000,
      page: 0,
      sort: {
        orders: [{
          direction: "DESC",
          property: "avaliacao",
          nullHandlingHint: "NATIVE"
        }]
      }
    }
  };

  /**
   *
   * @type {Array}
   */
  filters: string[] = [];

  /*-------------------------------------------------------------------
   *                           CONSTRUCTORS
   *-------------------------------------------------------------------*/

  /**
   *
   * @param dialog
   */
  constructor(public dialog: MatDialog)
  {
  }

  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/

  /**
   *
   */
  public ngOnInit()
  {
    this.listCursoByFilters(this.filters, this.dataFilter, null, this.page.pageable);

  }

  /**
   *
   */
  public listCursoByFilters(filters, dataFilter, idAreaConhecimento, pageable): void
  {
    let chipValue = this.chips._inputChild.value;
    if (chipValue && chipValue != this.chips.value[this.chips.value.length - 1])
    {
      this.chips.value.push(chipValue);
      this.chips._inputChild.value = "";
    }

    /**
     * Seta as horas como 0, pois a query filtra pelas horas também TODO verificar melhor forma
     */
    if (dataFilter)
    {
      dataFilter.setHours(0);
      dataFilter.setMinutes(0);
    }

    /**
     *
     */
    Broker.of("cursoService").promise("listCursosAprovadosByFilters", (filters && filters.length == 0)? null: filters.join(), dataFilter, idAreaConhecimento, pageable)
      .then((result) =>
      {
        let page = this.page;
        this.page.content = result.content;
        this.page.pageable = page.pageable;
      })
      .catch((message) =>
      {
      });
  }

    /**
   *
   */
  public sugerirCurso()
  {
    this.dialog.open(SugerirCursoComponent);
  }
}

