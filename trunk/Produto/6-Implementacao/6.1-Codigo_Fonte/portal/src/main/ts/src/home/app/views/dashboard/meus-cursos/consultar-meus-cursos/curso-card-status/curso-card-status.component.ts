import { CursoCardComponent } from './../../../../curso/consultar-cursos-aprovados/curso-card/curso-card.component';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Broker } from 'eits-ngx';

@Component({
  selector: 'curso-card-status',
  templateUrl: './curso-card-status.component.html',
  styleUrls: ['./curso-card-status.component.css']
})
export class CursoCardStatusComponent implements OnInit
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
  constructor(public router: Router, public activatedRoute: ActivatedRoute, public changeDetectionRef: ChangeDetectorRef)
  {
  }

  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/

  /**
   * Precisa de outro ciclo de verificação
   * depois de iniciar a interface, para verificar
   * o bind o elemento do nome, caso isso não seja feito
   * estoura um excessão somente no ambiente de desenvolvimento
   */
  ngAfterViewInit(): void
  {
    this.changeDetectionRef.detectChanges();
  }
  /**
   *
   */
  ngOnInit(): void
  {
    Broker.of("turmaService").promise("listTurmasDisponiveisByCursoId", this.curso.id, null)
      .then((result) =>
      {
        this.curso.turmas = result.content;
        Broker.of("turmaService").promise("findProximaTurmaDisponivelByCursoId", this.curso.id)
          .then((result) =>
          {
            if (result)
            {
              this.curso.proximaTurma = result;
              Broker.of("turmaService").promise("findPrimeiraAulaByTurmaId", this.curso.proximaTurma.id)
                .then((result) =>
                {
                  this.curso.proximaTurma.primeiraAula = result;
                });
            }
          });
      });
    this.findCursoImagemByCursoId(this.curso.id);

  }

  /**
   *
   * @param cursoId
   */
  public findCursoImagemByCursoId(cursoId)
  {
    Broker.of("cursoService").promise("findCursoImagemByCursoId", cursoId)
      .then((result) =>
      {
        this.curso.imagem = result;
      })
  }

  /**
   * 
   * @param curso 
   */
  public goToVisualizarCurso(curso: any)
  {
    let NProgress = window['NProgress'];
    NProgress.start();
    NProgress.inc();

    //Navega a partir da rota atual
    this.router.navigate([CursoCardComponent.parseNomeUrl(curso.nome, curso.id)], { relativeTo: this.activatedRoute });
  }

}
