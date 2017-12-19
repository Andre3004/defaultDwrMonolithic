import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";
import { Broker } from "eits-ngx";
import { AuthenticatedUserService } from '../../../controls/authenticated-user/authenticated-user.service';
import { Http, URLSearchParams } from "@angular/http";
import { ToastyService } from "ng2-toasty";
import * as moment from 'moment';
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'completar-cadastro-aluno',
  templateUrl: './completar-cadastro-aluno.component.html',
  styleUrls: ['./completar-cadastro-aluno.component.css']
})
export class CompletarCadastroAlunoComponent implements OnInit
{
  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  public messageErroDefault: string = 'Nome de usuário ou senha não conferem';

  /**
   *
   * @type {{fileTransfer: any; telefone: any; foto: any; id: any; nome: any; email: any; password: any; confirmacaoPassword: any; documento: any; isInstrutor: boolean; isEmpresa: boolean; endereco: {cidade: {nome: any}}}}
   */
  usuario: any = {
    fileTransfer: null,
    telefone: null,
    foto: null,
    id: null,
    nome: null,
    email: null,
    password: null,
    confirmacaoPassword: null,
    documento: null,
    isInstrutor: false,
    isEmpresa: false,
    documentoEstrangeiro: null,
    isEstrangeiro: false,
    tipoDocumentoEstrangeiro: null,
    endereco: {},
  };

  /**
   * Criado para receber se os termos de uso foram aceitos
   * o parâmetro isAccepted é usado, pois se usar o parâmetro
   * sozinho, o bind é perdido.
   */
  public termosUso: any = {
    isAccepted: false,
    requiredError: false
  };

  /**
   *
   */
  public subscription: Subscription;

  /*-------------------------------------------------------------------
   *                           CONSTRUCTORS
   *-------------------------------------------------------------------*/

  /**
   *
   */
  constructor(public activatedRoute: ActivatedRoute, public http: Http, public snackBar: MatSnackBar, public router: Router, public authenticatedUserService: AuthenticatedUserService, public toastyService: ToastyService)
  {
    this.subscription = authenticatedUserService.authenticatedUserChanged.subscribe((user) =>
    {
      if (user.id)
      {
        this.usuario.isAdministrador = user.isAdministrador;
        this.usuario.isInstrutor = user.isInstrutor;
        this.toMyAccount();
      }
    });
  }

  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/

  /**
   *
   */
  toMyAccount()
  {
    if (this.usuario.isAdministrador)
    {
      this.router.navigate(['dashboard/cursos']);
    }
    else if (this.usuario.isInstrutor)
    {
      this.router.navigate(['dashboard/meus-cursos']);
    }
    else
    {
      this.router.navigate(['dashboard/minhas-compras']);
    }
  }
  /**
   *
   */
  ngOnInit()
  {
    Broker.of("usuarioService").promise("findUsuarioByIdToCompleteRegister", this.activatedRoute.snapshot.params['id'])
      .then((result) =>
      {
        if(result){

          if(!result.endereco){
            result.endereco = this.usuario.endereco;
          }
  
          this.usuario = result;
  
          if (this.usuario.dataNascimento)
          {
            this.usuario.dataNascimento = moment(this.usuario.dataNascimento, "DD/MM/YYYY").format("DD/MM/YYYY");
          }
        }
      })
      .catch((exception) =>
      {
        this.openSnackBar(exception.message);
      });
  }

  /**
   *
   */
  /**
   *
   */
  public save(): void
  {
    if (!this.termosUso.isAccepted)
    {
      this.termosUso.requiredError = true;
      return;
    }

    this.usuario.documento = this.getNumbers(this.usuario.documento);

    // Não mandar a foto em bytearray para o backend e somente se o usuário inseriu uma nova foto
    const foto = this.usuario.foto;
    this.usuario.foto = null;

    Broker.of("usuarioService").promise('createAccount', this.usuario, this.usuario.fileTransfer)
      .then((result) =>
      {
        this.usuario.id = result.id;
        this.usuario.foto = foto;
        this.success();
      })
      .catch((exception) =>
      {
        this.usuario.foto = foto;
        this.openSnackBar(exception.message);
      });
  }

  /**
   *
   */
  public success()
  {
    // Se já está autenticado, vai par ao minha conta //TODO verificar possibilidade de colocar no canactivate
    Broker.of("usuarioService").promise("getAuthenticatedUser")
      .then((result) =>
      {
        if (result)
        {
          this.authenticatedUserService.setAuthenticatedUser(result);

          Broker.of("usuarioService").promise("findUsuarioFotoByUsuarioId", result.id)
            .then((result) =>
            {
              this.authenticatedUserService.setFotoUserAuthenticated(result);
            });

          this.router.navigate(['/dashboard/minha-conta']);
          this.openSnackBar('Conta completada com sucesso');
        }
      }).catch(exception =>
      {

      });
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
   * @param body
   * @returns {Promise<T>}
   */
  public login(body: any): Promise<any>
  {
    return this.http.post("authenticate", body).toPromise();
  }

  /**
   *
   * @param fileTransfer
   */
  public insertUsuarioFoto(fileTransfer: any)
  {
    Broker.of("usuarioService").promise("insertUsuarioFoto", fileTransfer, this.usuario.id)
      .then((result) =>
      {
        this.success();
      })
      .catch((exception) =>
      {
        this.openSnackBar(exception.message);
      });
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
   * @param str
   */
  public getNumbers(str: string)
  {
    return str.replace(/[^0-9]/g, '');// Sobrescreve tudo o que nao é número com vazio
  }

}
