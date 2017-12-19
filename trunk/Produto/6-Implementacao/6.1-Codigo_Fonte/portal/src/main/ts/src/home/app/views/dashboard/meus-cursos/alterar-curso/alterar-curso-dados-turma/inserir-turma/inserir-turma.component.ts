import { MatSnackBar } from '@angular/material';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Broker } from 'eits-ngx';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'inserir-turma',
  templateUrl: './inserir-turma.component.html',
  styleUrls: ['./inserir-turma.component.css']
})
export class InserirTurmaComponent implements OnInit
{


  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  turma: any = {
    curso: { id: this.activatedRoute.parent.parent.snapshot.params['id'] },
    quantidadeVagas: null,
    minimoMatriculas: null,
    tipoTurma: 'PRESENCIAL',
    plataforma: null,
    endereco: { cidade: { nome: null } },
    instrutores: [],
    id: null
  };

  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/
  /**
   *
   * @param dialog
   */
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
    this.findCursoById();
  }

  /**
   * Não substitui o objeto inteiro pra
   * não perder o bind
   */
  initiateTurma()
  {
    this.turma.id = null;
    this.turma.quantidadeVagas = null;
    this.turma.minimoMatriculas = null;
    this.turma.tipoTurma = 'PRESENCIAL';
    this.turma.plataforma = null;
    this.turma.endereco = { cidade: { nome: null } },
      this.turma.instrutores = [];
  }

  /**
   *
   */
  public findCursoById()
  {
    Broker.of("cursoService").promise("findCursoById", this.turma.curso.id)
      .then((result) =>
      {
        if (result)
        {
          this.turma.curso = result;
        }
        else
        {
          this.openSnackBar("Curso não encontrado!");
          this.router.navigate(["../../"], { relativeTo: this.activatedRoute });
        }
      })
      .catch((message) =>
      {
        console.log(message);
        this.openSnackBar("Curso não encontrado!");
        this.router.navigate(["../../"], { relativeTo: this.activatedRoute });
      });
  }
  /**
   *
   * @param turmaForm
   */
  public save(event: Event)
  {
    Broker.of("turmaService").promise("insertTurma", this.turma)
      .then((result) =>
      {
        if(result){
          this.turma.id = result.id;
          this.openSnackBar('Turma inserida com sucesso');
        }
      })
      .catch((exception) =>
      {
        this.openSnackBar(exception.message)
      });
  }

  /**
   *
   */
  public cancel()
  {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
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
