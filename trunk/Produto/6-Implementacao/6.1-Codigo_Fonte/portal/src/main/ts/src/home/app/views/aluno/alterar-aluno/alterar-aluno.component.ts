import { Component, OnInit } from "@angular/core";
import { textMasks } from "../../../controls/text-masks/text-masks";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";
import { Broker } from "eits-ngx";
import { AuthenticatedUserService } from '../../../controls/authenticated-user/authenticated-user.service';
import {ToastyService} from "ng2-toasty";

@Component({
  selector: 'alterar-aluno',
  templateUrl: './alterar-aluno.component.html',
  styleUrls: ['./alterar-aluno.component.css']
})
export class AlterarAlunoComponent implements OnInit
{
  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/
  /**
   * Data de hoje
   * @type {Date}
   */
  today: Date = new Date();

  /**
   *
   */
  masks = textMasks;


  /**
   *
   * @type {{fileTransfer: any; telefone: any; foto: any; id: any; nome: any; email: any; password: any; confirmacaoPassword: any; documento: any; isEmpresa: boolean; endereco: {cidade: {nome: any}}}}
   */
  usuario : any = {
    fileTransfer: null,
    telefone: null,
    foto: null,
    id: null,
    nome: null,
    email: null,
    password: null,
    confirmacaoPassword: null,
    documento: null,
    isEmpresa: false,
    isInstrutor: null,
    endereco: {},
    areasInteresse : [],
    areasAtuacao : []
  };

  /*-------------------------------------------------------------------
   *                           CONSTRUCTORS
   *-------------------------------------------------------------------*/
  /**
   *
   */
  constructor(public activatedRoute: ActivatedRoute, public snackBar: MatSnackBar, public router: Router, public authenticatedUserService: AuthenticatedUserService, public toastyService: ToastyService)
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
    this.findUsuarioById(this.activatedRoute.snapshot.params['id']);
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
   */
  public updateUsuario(): void
  {
    // Alterar dados do usuario
    let fileTransfer = this.usuario.fileTransfer;
    let foto = this.usuario.foto;

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
            }).catch(exception=> {
              this.error(exception.message);
            })
        }
        this.insertFoto(foto, fileTransfer);
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
    if(this.usuario.id == this.authenticatedUserService.getObservedAuthenticatedUser().id)
    {
      this.authenticatedUserService.setAuthenticatedUser(this.usuario);
    }

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
        if(this.usuario.id == this.authenticatedUserService.getObservedAuthenticatedUser().id)
        {
          this.usuario.foto = result;
          this.authenticatedUserService.setFotoUserAuthenticated(this.usuario.foto);
        }

        this.success('Aluno alterado com sucesso');
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
        if(this.usuario.id == this.authenticatedUserService.getObservedAuthenticatedUser().id)
        {
          this.usuario.foto = result;
          this.authenticatedUserService.setFotoUserAuthenticated(this.usuario.foto);
        }

        this.success('Aluno alterado com sucesso');
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
    this.router.navigate(['/dashboard/alunos/' + this.usuario.id]);
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
