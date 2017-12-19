import { Component, OnInit, Inject } from '@angular/core';
import { Broker } from 'eits-ngx';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-bloquear-alunos',
  templateUrl: './bloquear-alunos.component.html',
  styleUrls: ['./bloquear-alunos.component.css']
})
export class BloquearAlunosComponent implements OnInit
{

  /**
   *
   */
  alunos: any[];

  /**
   * Data de hoje
   * @type {Date}
   */
  today: Date = new Date();

  /**
   *
   * @param snackBar
   */
  constructor(public snackBar: MatSnackBar, private dialogRef: MatDialogRef<BloquearAlunosComponent>, @Inject(MAT_DIALOG_DATA) public data: any)
  {
    this.alunos = data;
  }

  /**
   *
   */
  dataBloqueio: Date;

  /**
   *
   */
  dataDesbloqueio: Date;

  /**
   *
   */
  ngOnInit()
  {
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
  public bloquear()
  {
    let alunoIds = this.alunos.map((aluno) => aluno.id);

    Broker.of("usuarioService").promise("bloquearAlunos", alunoIds, this.dataBloqueio, this.dataDesbloqueio)
      .then((result) =>
      {
        this.openSnackBar("Bloqueio do aluno atualizado com sucesso!");
        this.dialogRef.close(result);
      })
      .catch((exception) =>
      {
        this.openSnackBar(exception.message);
      })
  }
}
