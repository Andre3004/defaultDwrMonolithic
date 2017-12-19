import { Component } from "@angular/core";
import { Broker } from "eits-ngx";
import { ActivatedRoute } from "@angular/router";


/**
 *
 */
@Component({
  selector: 'codigo-incorporacao',
  templateUrl: './codigo-incorporacao-view.component.html',
  styleUrls: ['./codigo-incorporacao-view.component.css']
})
export class CodigoIncorporacaoView
{
  /*-------------------------------------------------------------------
  *                           ATTRIBUTES
  *-------------------------------------------------------------------*/
  /**
   *
   */
  turma: any;

  /**
   *
   */
  curso: any;

  /**
   *
   */
  origin: string = window.location.origin;

  /*-------------------------------------------------------------------
  *                           CONSTRUCTORS
  *-------------------------------------------------------------------*/
  /**
   *
   */
  constructor(public activatedRoute : ActivatedRoute)
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
    this.findTurmaById(+this.activatedRoute.snapshot.params['id-turma']);
  }

  /**
   *
   * @param turmaId
   */
  public findTurmaById(turmaId: number): void
  {
    Broker.of("turmaService").promise("findTurmaById", turmaId)
      .then((result) =>
      {
        if (result)
        {
          this.turma = result;
          this.findPrimeiraEUltimaAulaByTurmaId(this.turma.id);
          this.findCursoById(this.turma.curso.id);
          this.findLotesByTurmaId(this.turma);
        }
        else
        {
          //TODO deu ruin
        }
      })
      .catch((message) =>
      {
        console.log(message);
      });
  }

  /**
   *
   * @param cursoId
   */
  public findCursoById(cursoId: number): any
  {
    Broker.of("cursoService").promise("findCursoById", cursoId)
      .then((result) =>
      {
        if (result)
        {
          this.curso = result;
          this.findCursoImagemByCursoId(this.curso.id);
        }
        else
        {
          //TODO deu ruin
        }
      })
      .catch((message) =>
      {
        //TODO deu ruin
      });
  }

  /**
   *
   * @param cursoId
   */
  public findCursoImagemByCursoId(cursoId: number): any
  {
    Broker.of("cursoService").promise("findCursoImagemByCursoId", cursoId)
      .then((result) =>
      {
        this.curso.imagem = result;
      })
      .catch((message) =>
      {
        //TODO deu ruin
      });
  }

  /**
   *
   * @param turmaId
   */
  public findPrimeiraEUltimaAulaByTurmaId(turmaId: number): any
  {
    Broker.of("turmaService").promise("findPrimeiraEUltimaAulaByTurmaId", turmaId)
      .then((result) =>
      {
        this.turma.aulas = result;
      })
      .catch((message) =>
      {
        //TODO deu ruin
      });
  }

  /**
   *
   */
  public goToMatricula()
  {
    this.openNewTab("/#/cursos/"+ this.curso.id +"/realizar-matriculas/" + this.turma.id);
  }

  /**
   *
   */
  public goToHomeTFC(): void
  {
     this.openNewTab("");
  }

  /**
   *
   * @param url
   */
  public openNewTab(url: string): void
  {
    window.open(window.location.origin + url)
  }


  /**
   * @param turma
   */
  public findLotesByTurmaId(turma): any
  {
    Broker.of("turmaService").promise("listLotesByTurmaId", turma.id)
      .then((result) =>
      {
        if (result.content.length)
        {
          turma.lotes = result.content;
        }
      })
      .catch((message) =>
      {
        console.log(message);
      });
  }

}
