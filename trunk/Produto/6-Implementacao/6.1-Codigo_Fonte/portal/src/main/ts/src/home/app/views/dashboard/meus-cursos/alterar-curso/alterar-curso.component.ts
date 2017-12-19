import { MatSnackBar } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Broker } from 'eits-ngx';

@Component({
  selector: 'alterar-curso',
  templateUrl: './alterar-curso.component.html',
  styleUrls: ['./alterar-curso.component.css']
})
export class AlterarCursoComponent implements OnInit
{

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  public curso: any;


  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/

  constructor(public activatedRoute: ActivatedRoute, public snackBar: MatSnackBar, public router: Router)
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
    Broker.of("cursoService").promise("findCursoById", this.activatedRoute.parent.snapshot.params['id'])
      .then((result) =>
      {
        this.curso = result;
        Broker.of("cursoService").promise("findCursoImagemByCursoId", this.curso.id)
          .then((result) =>
          {
            this.curso.imagem = result;
          });
        this.isEmpresa();
      })
      .catch((exception) =>
      {
      });
  }

  /**
   *
   */
  public isEmpresa()
  {
    if (this.curso.dadosDeposito && this.curso.dadosDeposito.documento && this.getNumbers(this.curso.dadosDeposito.documento).length > 11)
    {
      this.curso.dadosDeposito.dadosDepositoIsEmpresa = true;
    }
  }

  /**
   *
   * @param str
   */
  public getNumbers(str: string)
  {
    return str.replace(/[^0-9]/g, '');
  }


  /**
   *
   */
  public removeCursoImagem(): void
  {
    Broker.of("cursoService").promise("removeCursoImagem", this.curso.id)
      .then((result) =>
      {
        this.openSnackBar("Curso atualizado com sucesso");
        this.router.navigate(["/dashboard/meus-cursos/" + this.curso.id]);
      });
  }

  /**
   *
   * @param fileTransfer
   */
  public updateCursoImagem(fileTransfer: any)
  {
    Broker.of("cursoService").promise("updateCursoImagem", fileTransfer, this.curso.id)
      .then((result) =>
      {
        this.openSnackBar("Curso atualizado com sucesso");
        this.router.navigate(["/dashboard/meus-cursos/" + this.curso.id]);
      })
      .catch((exception) =>
      {
        this.openSnackBar(exception.message);
      });
  }

  /**
   *
   * @param curso
   */
  public save(curso)
  {
    // Não mandar a foto em bytearray para o backend pq quebra em alguns pcs
    this.curso.imagem = null;
    Broker.of("cursoService").promise("updateCurso", curso)
      .then((result) =>
      {
        if (this.curso.fileTransfer)
        {
          this.updateCursoImagem(this.curso.fileTransfer);
        }
        else if (this.curso.removeImagem)
        {
          this.removeCursoImagem();
        }
        else
        {
          this.openSnackBar("Curso atualizado com sucesso");
          this.router.navigate(["/dashboard/meus-cursos/" + this.curso.id]);
        }
        this.isEmpresa();
      })
      .catch((exception) =>
      {
        this.openSnackBar(exception.message);
      });
  }

  /**
   *
   */
  public updateCursoWithStatusPendente()
  {
    Broker.of("cursoService").promise("updateCursoWithStatusPendente", this.curso.id)
      .then((result) =>
      {
        if (this.curso.fileTransfer)
        {
          Broker.of("cursoService").promise("updateCursoImagem", this.curso.fileTransfer, this.curso.id)
            .then((result) =>
            {
              this.openSnackBar("Curso atualizado com sucesso");
              this.router.navigate(["/dashboard/meus-cursos/" + this.curso.id]);
            })
            .catch((exception) =>
            {
              this.openSnackBar(exception.message);
            });
        }
        else if (this.curso.removeImagem)
        {
          Broker.of("cursoService").promise("removeCursoImagem", this.curso.id)
            .then((result) =>
            {
              this.openSnackBar("Curso atualizado com sucesso");
              this.router.navigate(["/dashboard/meus-cursos/" + this.curso.id]);
            });
        }
        else
        {
          this.openSnackBar("Curso enviado para aprovação");
          this.router.navigate(["/dashboard/meus-cursos/" + this.curso.id]);
        }
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
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }

}
