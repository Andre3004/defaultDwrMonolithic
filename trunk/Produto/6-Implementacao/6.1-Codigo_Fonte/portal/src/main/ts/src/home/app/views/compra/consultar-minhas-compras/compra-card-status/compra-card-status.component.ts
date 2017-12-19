import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Broker } from 'eits-ngx';
import {AuthenticatedUserService} from "../../../../controls/authenticated-user/authenticated-user.service";

@Component({
  selector: 'compra-card-status',
  templateUrl: './compra-card-status.component.html',
  styleUrls: ['./compra-card-status.component.css']
})
export class CompraCardStatusComponent implements OnInit {

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
  public usuario: any;

  /*-------------------------------------------------------------------
   *                           CONSTRUCTORS
   *-------------------------------------------------------------------*/

  /**
   *
   */
  constructor(public router: Router, public activatedRoute: ActivatedRoute, public changeDetectionRef : ChangeDetectorRef, public authenticatedUserService: AuthenticatedUserService)
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
  ngAfterViewInit() : void {
    this.changeDetectionRef.detectChanges();
  }
  /**
   *
   */
  ngOnInit(): void
  {
    this.findCursoImagemByCursoId(this.compra.matriculas[0].lote.turma.curso.id);
    this.usuario = this.authenticatedUserService.getObservedAuthenticatedUser();
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
        this.compra.matriculas[0].lote.turma.curso.imagem = result;
      })
  }

/**
   *
   * @param curso
   * @param id
   */
  public goToVisualizarCompra(compraId: string)
  {
    //Navega a partir da rota atual
    this.router.navigate([compraId], {relativeTo: this.activatedRoute});
  }


}
