import {Component, Input, OnInit} from "@angular/core";

@Component({
  selector: 'turma-info',
  templateUrl: './turma-info.component.html',
  styleUrls: ['./turma-info.component.css']
})
export class TurmaInfoComponent implements OnInit
{
   /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/
   /**
   *
   */
  @Input()
  compra: any;

   /**
   *
   */
  @Input()
  turma: any;

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
  /**
   *
   */
  ngOnInit() :void
  {
  }

  /**
   *
   */
  public lotesSelecionadoLength() : boolean
  {
    if(this.turma.lotes)
    {
      return this.turma.lotes.filter(lote => lote.quantidade > 0).length;
    }
  }
}
