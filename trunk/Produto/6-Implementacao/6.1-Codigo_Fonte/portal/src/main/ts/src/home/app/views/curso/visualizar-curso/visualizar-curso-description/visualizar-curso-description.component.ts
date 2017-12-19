import {Component, Input, OnInit, Pipe, PipeTransform} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'visualizar-curso-description',
  templateUrl: './visualizar-curso-description.component.html',
  styleUrls: ['./visualizar-curso-description.component.css']
})
export class VisualizarCursoDescriptionComponent implements OnInit
{
  /*-------------------------------------------------------------------
  *                           ATTRIBUTES
  *-------------------------------------------------------------------*/
  /**
   *
   */
  @Input()
  curso: any;

  /*-------------------------------------------------------------------
  *                           CONSTRUCTORS
   *-------------------------------------------------------------------*/
  /**
   *
   */
  constructor()
  {
  }

  /*-------------------------------------------------------------------
  *                           BEHAVIORS
  *-------------------------------------------------------------------*/
  
  ngOnInit(): void
  {
  }
  
}