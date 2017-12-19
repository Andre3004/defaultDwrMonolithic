import { Component, Input, OnInit, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { Broker } from "eits-ngx";
import { forEach } from '@angular/router/src/utils/collection';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'visualizar-compra',
  templateUrl: './visualizar-compra.component.html',
  styleUrls: ['./visualizar-compra.component.css']
})
export class VisualizarCompraComponent implements OnInit, AfterViewInit
{
  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
  */
  lotes = [];

  /**
   *
   */
  @Input()
  compra: any;

  /**
   *
   */
  curso: any;

  /**
   *
   */
  turma: any;

  /**
   *
   */
  showMap: boolean;

  /**
   *
   *  @type {{PRESENCIAL: string; DISTANCIA: string; SEMIPRESENCIAL: string}}
   */
  tipoTurma = {
    PRESENCIAL: "PRESENCIAL",
    DISTANCIA: "DISTANCIA",
    SEMIPRESENCIAL: "SEMIPRESENCIAL"
  };


  /*-------------------------------------------------------------------
   *                           CONSTRUCTORS
   *-------------------------------------------------------------------*/
  /**
   *
   */
  constructor(public activatedRoute: ActivatedRoute, public router: Router, public changeDetectionRef : ChangeDetectorRef)
  {
  }
  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/
  /**
   *
   */
  ngOnInit(): void
  {
    this.turma = this.compra.matriculas[0].lote.turma;
    this.curso = this.compra.matriculas[0].lote.turma.curso;

    this.findInstrutoresByTurmaId(this.turma);

    this.prepareLotes(this.compra);

    this.prepareMatriculas(this.compra);
  }

  
  /**
   *
   * @param compra
   */
  prepareLotes(compra:any)
  {
    if (!compra) return;

    for (let _i = 0; _i < compra.matriculas.length; _i++) 
    {
      if(this.containLote(compra.matriculas[_i].lote.id) == false)
      {
        this.lotes.push(compra.matriculas[_i].lote);
        continue;
      }
    }
  }

  /**
   *
   * @param loteId
   * @returns {boolean}
   */
  containLote(loteId:number): boolean
  {
    for (let _i = 0; _i < this.lotes.length; _i++) 
    {
      if (this.lotes[_i].id === loteId)
      {
        return true;
      }
    }
        
    return false;
  }


  /**
   *
   * @param compra
   */
  prepareMatriculas(compra:any)
  {
    if (!compra) return;

    for (let _i = 0; _i < compra.matriculas.length; _i++) 
    {
      for (let _j = 0; _j < this.lotes.length; _j++) 
      {
        if (this.lotes[_j].id === compra.matriculas[_i].lote.id)
        {
          if (!this.lotes[_j].matriculas) this.lotes[_j].matriculas = [];
          this.lotes[_j].matriculas.push(compra.matriculas[_i]);
        }
      }
    }
  }

  /**
   *
   */
  ngAfterViewInit()
  {
    this.showMap = true;
    this.changeDetectionRef.detectChanges();
  }

  /**
   *
   * @param turma
   */
  public findInstrutoresByTurmaId(turma)
  {
      Broker.of("usuarioService").promise("findInstrutoresByTurmaId", turma.id, null)
      .then((result) =>
      {
        turma.instrutores = result.content;
        this.findinstrutoresFotoByUsuarioId(turma.instrutores);
      })
      .catch((message) =>
      {
        console.log(message);
      });
  }

 /**
  *
  * @param alunoId
  */
  public findinstrutoresFotoByUsuarioId(instrutores: any)
  {
    instrutores.forEach(
      instrutor =>
      {
        Broker.of("usuarioService").promise("findUsuarioFotoByUsuarioId", instrutor.usuario.id)
          .then((result) =>
          {
            instrutor.usuario.foto = result;
          })
          .catch((exception) =>
          {
            console.log(exception);
          });
      });
  }

}
