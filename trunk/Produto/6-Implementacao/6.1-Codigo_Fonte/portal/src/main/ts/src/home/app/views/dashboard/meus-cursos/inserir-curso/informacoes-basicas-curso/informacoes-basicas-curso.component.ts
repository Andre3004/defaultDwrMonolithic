import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar, MatStepperModule } from "@angular/material";
import { Router } from "@angular/router";
import { Broker } from "eits-ngx";

@Component({
  selector: 'informacoes-basicas-curso',
  templateUrl: './informacoes-basicas-curso.component.html',
  styleUrls: ['./informacoes-basicas-curso.component.css']
})
export class InformacoesBasicasCursoComponent implements OnInit
{

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  @Input()
  public curso: any = {
    dadosDeposito: {
      dadosDepositoIsEmpresa: false
    },
    areaAtuacao: {
      instrutor: {}
    },
    instrutor: {},
    turmas: []
  };

  /**
   *
   */
  @Input()
  isInserir: boolean;

  /**
   *
   */
  cursoAreaConhecimento: any;

  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/

  constructor(public snackBar: MatSnackBar, public router: Router)
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
  }

  /**
   * @param curso
   */
  public save()
  {
    if (this.isInserir)
    {
      this.insertCurso();
    }
    else
    {
      this.updateCurso();
    }
  }

  /**
   *
   */
  public insertCurso()
  {
    let imagem = this.curso.imagem;

    // Não mandar a foto em bytearray para o backend pq fica muito pesado
    this.curso.imagem = null;

    Broker.of("cursoService").promise("insertCurso", this.curso)
      .then((result) =>
      {
        this.curso.id = result.id;

        if (this.curso.fileTransfer)
        {
          this.updateCursoImagem(this.curso.fileTransfer);
        }
        else
        {
          this.openSnackBar("Novo curso inserido com sucesso!");
          this.router.navigate(["/dashboard/meus-cursos/" + result.id + "/curso-inserido"]);
        }
      })
      .catch((exception) =>
      {
        this.curso.imagem = imagem;
        this.openSnackBar(exception.message);
      });
  }

  /**
   *
   */
  public updateCurso()
  {
    let imagem = this.curso.imagem;

    // Verifica se o usuario inseriu uma nova foto
    if (this.curso.imagem > 200)
      this.curso.imagem = null;

    Broker.of("cursoService").promise("updateCurso", this.curso)
      .then((result) =>
      {
        this.curso.id = result.id;

        if (this.curso.fileTransfer)
        {
          this.updateCursoImagem(this.curso.fileTransfer);
        }
        else
        {
          this.openSnackBar("Curso alterado com sucesso!");
          this.router.navigate(["/dashboard/meus-cursos/" + result.id + "/alterar/turmas/inserir"]);
        }
      })
      .catch((exception) =>
      {
        this.curso.imagem = imagem;
        this.openSnackBar(exception.message);
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
        this.openSnackBar("Novo curso inserido com sucesso");
        this.router.navigate(["/dashboard/meus-cursos/" + this.curso.id + "/curso-inserido"]);
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

  /**
   *
   */
  public saveCurso(stepper: any): void
  {
    if (this.curso.isGratuito)
    {
      this.save()
    }
    else
    {
      stepper.selectedIndex = 1;
    }
  }


}
