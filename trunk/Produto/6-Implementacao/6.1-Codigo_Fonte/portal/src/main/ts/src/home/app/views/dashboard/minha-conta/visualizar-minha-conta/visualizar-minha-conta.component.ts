import { AuthenticatedUserService } from '../../../../controls/authenticated-user/authenticated-user.service';
import { Component, OnInit } from '@angular/core';
import { textMasks } from '../../../../controls/text-masks/text-masks';
import { ActivatedRoute, Router } from '@angular/router';
import { Broker } from 'eits-ngx';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AlterarMinhaSenhaComponent } from '../alterar-minha-senha/alterar-minha-senha.component';

@Component({
  selector: 'visualizar-minha-conta',
  templateUrl: './visualizar-minha-conta.component.html',
  styleUrls: ['./visualizar-minha-conta.component.css']
})
export class VisualizarMinhaContaComponent implements OnInit
{

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {{fileTransfer: any; foto: any; id: any; nome: any; email: any; password: any; confirmacaoPassword: any; documento: any; isEmpresa: boolean; endereco: {cidade: {nome: any}}}}
   */
  usuario = {
    areasInteresse: null,
    fileTransfer: null,
    foto: null,
    id: null,
    nome: null,
    email: null,
    password: null,
    isInstrutor:null,
    confirmacaoPassword: null,
    documento: null,
    isEmpresa: false,
    endereco: {
      cidade: {
        nome: null
      }
    }
  };

  /**
   * Cor do slide
   * @type {string}
   */
  color = 'primary';

  /*-------------------------------------------------------------------
   *                           CONSTRUCTORS
   *-------------------------------------------------------------------*/

  /**
   *
   * @param activatedRoute
   * @param router
   * @param snackBar
   * @param dialog
   * @param authenticatedUserService
   */
  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
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
    this.getAuthenticatedUser();
  }

  /**
   *
   * @param instrutor
   */
  public updateUsuarioChangingOpcoesInstrutor(usuario: any) : any
  {
    Broker.of("usuarioService").promise("updateUsuarioChangingOpcoesInstrutorAndAuthorities", usuario.id)
      .then((result) =>
      {
        usuario.isInstrutor = result.isInstrutor;
        this.authenticatedUserService.setAuthenticatedUser(usuario);
      })
      .catch((exception) =>
      {
        this.openSnackBar(exception);
        usuario.isInstrutor = false;
      })
  }

  /**
   *
   */
  public getAuthenticatedUser()
  {
    this.authenticatedUserService.getPromiseAuthenticatedUser()
      .then((authenticatedUser) =>
      {
        if (authenticatedUser)
        {
          this.usuario = authenticatedUser;
          this.findUsuarioFotoByUsuarioId(authenticatedUser.id);
        }
      })
      .catch((exception) =>
      {
      })
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

  /**
   *
   * @param message
   */
  public openSnackBar(message: string)
  {
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }

  /**
   *
   */
  public alterarMinhaSenha()
  {
    let dialogRef = this.dialog.open(AlterarMinhaSenhaComponent, {
      data: this.usuario,
    });
  }

}
