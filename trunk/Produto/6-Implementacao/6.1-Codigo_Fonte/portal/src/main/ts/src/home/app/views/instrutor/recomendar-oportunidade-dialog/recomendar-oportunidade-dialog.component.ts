import { ViewChild } from '@angular/core';
import { Broker } from 'eits-ngx';
import { MatDialogRef } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { TdChipsComponent } from "@covalent/core";

@Component({
  selector: 'recomendar-oportunidade-dialog',
  templateUrl: './recomendar-oportunidade-dialog.component.html',
  styleUrls: ['./recomendar-oportunidade-dialog.component.css']
})
export class RecomendarOportunidadeDialogComponent implements OnInit
{


  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  descricao: String;

  /**
   *
   */
  areasConhecimento: String[] = [];

  /**
   *
   */
  areasConhecimentoList: String[] = [];

  /**
   *
   */
  oldFilter: String;

  /**
   *
   */
  @ViewChild(TdChipsComponent)
  chips: any;


  /**
   *
   */
  public pageable = {//PageRequest
    size: 50,
    page: 0,
    sort: null
  };

  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/

  /**
   *
   * @param dialogRef
   */
  constructor(public dialogRef: MatDialogRef<RecomendarOportunidadeDialogComponent>)
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
    this.listAreaConhecimentoByFilters("");
  }


  /**
   *
   */
  public listAreaConhecimentoByFilters(filter: String)
  {
    if (filter != this.oldFilter)
    {
      this.oldFilter = filter
      Broker.of("areaConhecimentoService").promise("listAllAreaConhecimentoByFilters", filter, this.pageable)
        .then((result) =>
        {
          this.areasConhecimentoList = result.content.map(function (contentItem) { return contentItem.nome; });
        })
        .catch((exception) =>
        {
          console.log(exception);
        })
    }
  }
}
