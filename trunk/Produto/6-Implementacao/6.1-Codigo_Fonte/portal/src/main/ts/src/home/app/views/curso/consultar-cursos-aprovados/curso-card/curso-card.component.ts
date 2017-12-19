import { Component, Input, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Broker } from "eits-ngx";
import { Router, ActivatedRoute } from "@angular/router";
import { remove } from 'diacritics';

@Component({
  selector: 'curso-card',
  templateUrl: './curso-card.component.html',
  styleUrls: ['./curso-card.component.scss'],
})
export class CursoCardComponent implements OnInit, AfterViewInit
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
  public static splitCaracter: string = "__";

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

  /**
	 * Cria o nome do curso para colocar na URL
   * Tirando os acentos e caracteres especiais 
   * alem de substituir os caracteres não alfanumericos que sobraram com "-"
	 */
	public static parseNomeUrl(nomeCurso: string, cursoId: number): string
	{
    let nomeCursoUrl = remove(nomeCurso); //remove diacritics
    nomeCursoUrl = nomeCursoUrl.toLowerCase().replace( /[^A-Za-z0-9]/g, "-" );
		return nomeCursoUrl + CursoCardComponent.splitCaracter + cursoId;
  }
}
