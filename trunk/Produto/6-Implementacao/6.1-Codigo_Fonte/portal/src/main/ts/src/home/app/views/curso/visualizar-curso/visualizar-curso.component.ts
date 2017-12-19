import { CursoCardComponent } from './../consultar-cursos-aprovados/curso-card/curso-card.component';
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Broker } from "eits-ngx";
import "rxjs/add/operator/switchMap";
import { MatDialog, MatSnackBar } from "@angular/material";
import { RecusarCursoComponent } from "./recusar-curso/recusar-curso.component";
import { ConfirmDialogComponent } from "./../../../controls/confirm-dialog/confirm-dialog.component";
import { AuthenticatedUserService } from "../../../controls/authenticated-user/authenticated-user.service";
import { CodigoIncorporacaoComponent } from "../codigo-incorporacao/codigo-incorporacao.component";

/**
 *
 */
@Component({
  selector: 'visualizar-curso',
  templateUrl: './visualizar-curso.component.html',
  styleUrls: ['./visualizar-curso.component.css']
})
export class VisualizarCursoComponent implements OnInit
{
  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  curso: any = {};

  /**
   *
   */
  authenticatedUser: any;

  /**
   * 
   */
  splitCaracter: string = CursoCardComponent.splitCaracter;

  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/

  /**
   *
   * @param activatedRoute
   * @param snackBar
   * @param router
   * @param dialog
   * @param authenticatedUserService
   */
  constructor(public activatedRoute: ActivatedRoute, public snackBar: MatSnackBar, public router: Router, public dialog: MatDialog)
  {
  }

  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/
  /**
   *
   * @param route
   * @param router
   */
  ngOnInit(): void
  {
    this.curso.id = this.parseCursoId(this.activatedRoute.snapshot.params['id']);

    Broker.of("cursoService").promise("findCursoById", this.curso.id)
      .then((result) =>
      {
        if (result)
        {
          this.curso = result;
          this.findCursoImagemByCursoId(this.curso.id);
          this.findUsuarioFotoByUsuarioId(this.curso.organizador);
        }
        else
        {
          this.cursoNotFound();
        }
      })
      .catch((exception) =>
      {
        this.cursoNotFound();
      });
  }

  private cursoNotFound()
  {
    this.router.navigate([""], { relativeTo: this.activatedRoute.parent });
    this.snackBar.open('Curso não encontrado', 'Fechar', {
      duration: 3000
    });
  }

  /**
   * Pega o id do curso logo após o split caracter
   */
  public parseCursoId(cursoIdStr: string): number
  {
    if (cursoIdStr && cursoIdStr.includes(this.splitCaracter))
    {
      return +cursoIdStr.substr(cursoIdStr.indexOf(this.splitCaracter) + this.splitCaracter.length)
    }
    else
    {
      if (cursoIdStr.match(/^\d+$/)) // se é um número
      {
        return +cursoIdStr;
      }
      else
      {
        this.cursoNotFound();
      }
    }
  }

  /**
   *
   * @param usuario
   */
  public findUsuarioFotoByUsuarioId(usuario: any): void
  {
    Broker.of("usuarioService").promise("findUsuarioFotoByUsuarioId", usuario.id)
      .then((result) =>
      {
        if (result)
        {
          usuario.foto = result;
        }
      })
      .catch((exception) =>
      {
        console.log(exception);
      });
  }

  /**
   *
   * @param cursoId
   */
  public findCursoImagemByCursoId(cursoId): void
  {
    Broker.of("cursoService").promise("findCursoImagemByCursoId", cursoId)
      .then((result) =>
      {
        this.curso.imagem = result;
      })
      .catch((message) =>
      {
        console.log(message);
      });
  }

  public isProximaTurmaSemiPresencial()
  {
    if (this.curso.proximaTurma &&
      this.curso.proximaTurma.tipoTurma &&
      this.curso.proximaTurma.tipoTurma === "SEMIPRESENCIAL")
    {
      return true;
    }
    else
    {
      return false
    }
  }
  
}
