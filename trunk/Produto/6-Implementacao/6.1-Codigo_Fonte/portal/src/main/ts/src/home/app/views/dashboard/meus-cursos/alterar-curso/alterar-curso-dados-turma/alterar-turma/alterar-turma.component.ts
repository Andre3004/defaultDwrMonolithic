import { MatSnackBar } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Broker } from 'eits-ngx';

@Component({
  selector: 'alterar-turma',
  templateUrl: './alterar-turma.component.html',
  styleUrls: ['./alterar-turma.component.css']
})
export class AlterarTurmaComponent implements OnInit
{

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/
  /**
   *
   */
  turma = {
    id: null,
    quantidadeVagas: null,
    minimoMatriculas: null,
    tipoTurma: 'PRESENCIAL',
    plataforma: null,
    endereco: {
      cidade: {
        nome: null
      }
    }
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
    Broker.of("turmaService").promise("findTurmaById", this.activatedRoute.snapshot.params['id-turma'])
      .then((result) =>
      {
        if (result)
        {
          this.turma = result;
          if (!this.turma.endereco)
          {
            this.turma.endereco = {
              cidade: {
                nome: null
              }
            }
          }
        }
        else
        {
          this.openSnackBar("Turma não encontrada");
          this.router.navigate(["../../", { relativeTo: this.activatedRoute }]);
        }
      })
      .catch((exception) =>
      {
        console.log(exception.message);
        this.openSnackBar("Turma não encontrada");
        this.router.navigate(["../../", { relativeTo: this.activatedRoute }]);
      });
  }

  /**
   *
   */
  public save()
  {
    Broker.of("turmaService").promise("updateTurma", this.turma)
      .then((result) =>
      {
        if(result)
        {
          this.turma = result;
          this.openSnackBar('Turma alterada com sucesso');
        }
        else
        {
          this.openSnackBar('Não foi possível salvar a turma');
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
  public comeBack()
  {
    this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
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
