import {Component, Input, OnInit} from "@angular/core";
import {FaleComOrganizadorComponent} from "./fale-com-organizador/fale-com-organizador.component";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'organizador-preview',
  templateUrl: './organizador-preview.component.html',
  styleUrls: ['./organizador-preview.component.css']
})
export class OrganizadorPreviewComponent implements OnInit
{

 /*-------------------------------------------------------------------
  *                           ATTRIBUTES
  *-------------------------------------------------------------------*/
  /**
   *
   */
  @Input()
  curso: any;

  /**
   * 
   */
  organizador: any;

  /*-------------------------------------------------------------------
   *                           CONSTRUCTORS
   *-------------------------------------------------------------------*/
   /**
    *
    */
   constructor(public dialog: MatDialog, public router: Router, public activatedRoute: ActivatedRoute)
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
    this.organizador = this.curso.organizador;
  }

  /**
   *
   */
  openFaleComOrganizadorDialog()
  {
    let config: MatDialogConfig = {
      data: {cursoId: this.curso.id}
    };
    this.dialog.open(FaleComOrganizadorComponent, config);
  }

}
