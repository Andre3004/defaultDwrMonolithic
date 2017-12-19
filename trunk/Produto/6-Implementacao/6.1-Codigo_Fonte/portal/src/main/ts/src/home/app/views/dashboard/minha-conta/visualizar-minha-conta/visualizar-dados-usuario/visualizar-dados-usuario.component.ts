import { textMasks } from './../../../../../controls/text-masks/text-masks';
import { ActivatedRoute } from '@angular/router';
import { AuthenticatedUserService } from '../../../../../controls/authenticated-user/authenticated-user.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'visualizar-dados-usuario',
  templateUrl: './visualizar-dados-usuario.component.html',
  styleUrls: ['./visualizar-dados-usuario.component.css']
})
export class VisualizarDadosUsuarioComponent implements OnInit
{

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  @Input()
  usuario;

  /**
   *
   */
   textMasks: any = textMasks;

  /**
   *
   */
  authenticatedUser;

  /**
   *
   */
  public areasInteresse : any[];

  /**
   *
   */
  public areasAtuacao : any[];

  /*-------------------------------------------------------------------
   *                           CONSTRUCTORS
   *-------------------------------------------------------------------*/

  /**
   *
   * @param activatedRoute
   * @param authenticatedUserService
   */
  constructor(
    public activatedRoute: ActivatedRoute,
    public authenticatedUserService: AuthenticatedUserService)
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
    this.authenticatedUserService.getPromiseAuthenticatedUser()
      .then((authenticatedUser) =>
      {
        if (authenticatedUser)
        {
          this.authenticatedUser = authenticatedUser;
        }
      })
      .catch((exception) =>
      {
      });

    // Inicializa os arrays
    this.initArrays();

  }
  /**
   *
   */
  public initArrays()
  {
    this.areasAtuacao = [];
    this.areasInteresse = [];

    if (!this.usuario.areasAtuacao || !this.usuario.areasAtuacao.length )
    {
      this.usuario.areasAtuacao = [];
    }

    if (!this.usuario.areasInteresse || !this.usuario.areasInteresse.length )
    {
      this.usuario.areasInteresse = [];
    }

    // Popula variáveis auxiliares para exibir áreas de atuação e de interesse
    for (let areaAtuacao of this.usuario.areasAtuacao)
    {
      this.areasAtuacao.push(areaAtuacao.areaConhecimento);
    }

    for (let areaInteresse of this.usuario.areasInteresse)
    {
      this.areasInteresse.push(areaInteresse.areaConhecimento);
    }
  }


}
