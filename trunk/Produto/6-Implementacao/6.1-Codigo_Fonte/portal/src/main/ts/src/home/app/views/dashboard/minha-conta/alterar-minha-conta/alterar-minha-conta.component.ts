import { AuthenticatedUserService } from '../../../../controls/authenticated-user/authenticated-user.service';
import { Component, OnInit } from '@angular/core';
import { textMasks } from '../../../../controls/text-masks/text-masks';
import { Router } from '@angular/router';
import { Broker } from 'eits-ngx';
import { MatSnackBar } from '@angular/material';
import {ToastyService} from "ng2-toasty";
import { Location } from '@angular/common';

@Component({
  selector: 'alterar-minha-conta',
  templateUrl: './alterar-minha-conta.component.html',
  styleUrls: ['./alterar-minha-conta.component.css']
})
export class AlterarMinhaContaComponent implements OnInit
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
  usuario: any = {
    fileTransfer: null,
    foto: null,
    id: null,
    nome: null,
    email: null,
    password: null,
    confirmacaoPassword: null,
    documento: null,
    isEmpresa: false,
    endereco: {},
    areasInteresse : [],
    areasAtuacao : []
  };

  /**
   *
   */
  removeClicked: boolean = false;

  /*-------------------------------------------------------------------
   *                           CONSTRUCTORS
   *-------------------------------------------------------------------*/

  /**
   *
   * @param activatedRoute
   * @param router
   * @param snackBar
   * @param authenticatedUserService
   */
  constructor(public location: Location, public router: Router, public snackBar: MatSnackBar, public authenticatedUserService: AuthenticatedUserService, public toastyService: ToastyService)
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
   * @param usuarioId
   */
  public getAuthenticatedUser()
  {
    Promise.resolve(Broker.of("usuarioService").promise("getAuthenticatedUser"))
      .then((result) =>
      {
        this.usuario = result;
        this.findUsuarioFotoByUsuarioId(this.usuario.id);
      })
      .catch((exception) =>
      {
        this.error(exception.message);
      });
  }

  /**
   *
   */
  public updateMinhaConta(): void
  {
    let fileTransfer = this.usuario.fileTransfer;
    let foto = this.usuario.foto;

    //Somente deixa nulo caso for base64 o que significa que o usuário inseriu uma nova foto
    if (this.usuario.foto && this.usuario.foto.length > 200){
      this.usuario.foto = null;
    }

    let areasAtuacao = this.usuario.areasAtuacao;

    // Alterar dados do usuario
    Broker.of("usuarioService").promise("updateUsuario", this.usuario)
      .then((result) =>
      {
        this.usuario = result;
        this.usuario.dataNascimento = this.usuario.dataNascimento.toLocaleDateString().replace(/[^a-z0-9-]/g, '');

        //Se for instrutor insere a foto
        if(this.usuario.isInstrutor)
        {
          Broker.of("usuarioService").promise("insertAreasAtuacao", this.usuario.id, areasAtuacao)
            .then((result) =>
            {
              // O entity graph não traz as áreas de atuação, o entity graph só traz uma lista.
              // A lista escolha foi a de áreas de interesse
              this.usuario.areasAtuacao = areasAtuacao;

              this.insertFoto(foto,fileTransfer);
            }).catch(exception => {
              this.error(exception.message);
            });
        }
        // Esse else impede a assincronicidade
        else
        {
          this.insertFoto(foto,fileTransfer);
        }

      })
      .catch((exception) =>
      {
        if(foto)
          this.usuario.foto = foto;
        this.error(exception.message);
      });
  }

  /**
   *
   */
  public insertFoto(foto, fileTransfer)
  {
    this.authenticatedUserService.setAuthenticatedUser(this.usuario);

    // Alterar dados da foto do usuario somente se ele tem foto
    if (foto && foto.length > 200)
    {
      this.updateUsuarioFoto(fileTransfer);
    }
    else if (!foto && !fileTransfer)
    {
      this.removeAlunoFoto();
    }
    else
    {
      this.success('Usuário alterado com sucesso')
    }
  }

  /**
   *
   * @param fileTransfer
   */
  public updateUsuarioFoto(fileTransfer: any)
  {
    Broker.of("usuarioService").promise("updateUsuarioFoto", fileTransfer, this.usuario.id)
      .then((result) =>
      {
        this.usuario.foto = result;
        this.authenticatedUserService.setFotoUserAuthenticated(this.usuario.foto);
        this.success('Usuário alterado com sucesso');
      })
      .catch((exception) =>
      {
        this.error(exception.message);
      });
  }

  /**
   *
   */
  public removeAlunoFoto(): void
  {
    Broker.of("usuarioService").promise("removeUsuarioFoto", this.usuario.id)
      .then((result) =>
      {
        this.usuario.foto = null;
        this.authenticatedUserService.setFotoUserAuthenticated(null);
        this.success('Usuário alterado com sucesso');
      })
      .catch((exception) =>
      {
        this.error(exception.message)
      });
  }

  /**
   *
   * @param message
   */
  public success(message: string)
  {
    this.openSnackBar(message);

    this.location.back();
  }

  /**
   *
   * @param message
   */
  public error(message: string)
  {
    this.openSnackBar(message);
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string)
  {
    this.toastyService.clearAll();
    this.snackBar.open(message, "Fechar", {
      duration: 5000
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
