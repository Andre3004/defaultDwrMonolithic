import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Broker } from "eits-ngx";
import { AuthenticatedUserService } from '../../../controls/authenticated-user/authenticated-user.service';

@Component({
  selector: 'home-visualizar-instrutor',
  templateUrl: './visualizar-instrutor.component.html',
  styleUrls: ['./visualizar-instrutor.component.css']
})
export class VisualizarInstrutorComponent implements OnInit
{


  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  usuario: any = {
    endereco: null
  };

  /*-------------------------------------------------------------------
   *                           CONSTRUCTORS
   *-------------------------------------------------------------------*/
  /**
   *
   */
  constructor(
    public activatedRoute: ActivatedRoute,
    public authenticatedUserService: AuthenticatedUserService
  )
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
    let usuarioId: number = this.activatedRoute.snapshot.params['id'];

    if (usuarioId)
    {
      this.findUsuarioById(usuarioId);
    }
  }

  /**
   *
   * @param aluno
   */
  public updateUsuarioChangingOpcoesInstrutor(usuario: any) : any
  {
    Broker.of("usuarioService").promise("updateUsuarioChangingOpcoesInstrutor", usuario.id)
      .then((result) =>
      {
        usuario.isInstrutor = result.isInstrutor;
        if(usuario.id == this.authenticatedUserService.getObservedAuthenticatedUser().id)
        {
          this.authenticatedUserService.setAuthenticatedUser(usuario);
        }
      })
  }

  /**
   *
   * @param usuarioId
   */
  public findUsuarioById(usuarioId: number)
  {
    Broker.of("usuarioService").promise("findUsuarioById", + usuarioId)
      .then((result) =>
      {
        this.usuario = result;
        this.findUsuarioFotoByUsuarioId(usuarioId);
      });
  }

  /**
   *
   * @param usuarioId
   */
  public findUsuarioFotoByUsuarioId(usuarioId: number)
  {
    Broker.of("usuarioService").promise("findUsuarioFotoByUsuarioId", usuarioId)
      .then((result) =>
      {
        this.usuario.foto = result;
      })
  }

}
