import { Component, OnInit } from '@angular/core';
import { textMasks } from '../../../controls/text-masks/text-masks';
import { ActivatedRoute } from '@angular/router';
import { Broker } from 'eits-ngx';
import { AuthenticatedUserService } from '../../../controls/authenticated-user/authenticated-user.service';
import { MatSnackBar, MatDialog } from "@angular/material";
import { BloquearAlunosComponent } from '../bloquear-alunos/bloquear-alunos.component';

@Component({
  selector: 'visualizar-aluno',
  templateUrl: './visualizar-aluno.component.html',
  styleUrls: ['./visualizar-aluno.component.css']
})
export class VisualizarAlunoComponent implements OnInit
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
    endereco: null,
    contatoTelefonico: null
  };

  /**
   *
   * @type {{content: any; pageable: {size: number; page: number; sort: any}}}
   */
  page = {//PageImpl
    content: null,
    filters: null,
    pageable: {//PageRequest
      size: 50,
      page: 0,
      sort: null
    }
  };

  /**
   *
   */
  public areasConhecimento: any;

  /*-------------------------------------------------------------------
   *                           CONSTRUCTORS
   *-------------------------------------------------------------------*/

  /**
   *
   */
  constructor(
    public snackBar: MatSnackBar,
    public activatedRoute: ActivatedRoute,
    public authenticatedUserService: AuthenticatedUserService,
    public dialog: MatDialog
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

    this.findUsuarioById(usuarioId);
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

  /**
   *
   * @param instrutor
   */
  public updateUsuarioChangingOpcoesInstrutor(usuario: any): any
  {
    Broker.of("usuarioService").promise("updateUsuarioChangingOpcoesInstrutor", usuario.id)
      .then((result) =>
      {
        usuario.isInstrutor = result.isInstrutor;
        if (usuario.id == this.authenticatedUserService.getObservedAuthenticatedUser().id)
        {
          this.authenticatedUserService.setAuthenticatedUser(usuario);
        }
      })
      .catch((exception) =>
      {
        this.openSnackBar(exception.message);
        this.usuario.isInstrutor = false;
      })
  }

  /**
   * 
   */
  public bloquear()
  {
    let dialogRef = this.dialog.open(BloquearAlunosComponent, {
      data: [this.usuario],
      width: "600px"
    })

    dialogRef.afterClosed().subscribe(usuario =>
    {
      if (usuario)
      {
        this.usuario = usuario;
      }
    });
  }

  /**
   * 
   */
  public desbloquear()
  {
    Broker.of("usuarioService").promise("desbloquearAlunos", [this.usuario])
      .then((result) =>
      {
        this.ngOnInit();
        this.openSnackBar("Desbloqueio de aluno(s) realizado com sucesso!");
      })
      .catch((exception) =>
      {
        this.openSnackBar(exception.message);
      })
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
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }
}
