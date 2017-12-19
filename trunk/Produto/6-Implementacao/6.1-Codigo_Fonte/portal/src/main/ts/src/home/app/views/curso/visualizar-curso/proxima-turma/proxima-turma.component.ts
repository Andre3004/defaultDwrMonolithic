import { Component, Input, OnInit } from "@angular/core";
import { Broker } from "eits-ngx";
import "rxjs/add/operator/switchMap";

@Component({
  selector: 'proxima-turma',
  templateUrl: './proxima-turma.component.html',
  styleUrls: ['./proxima-turma.component.css']
})
export class ProximaTurmaComponent implements OnInit
{
  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  @Input()
  curso: any;

  /**
   *
   */
  @Input()
  cargaHoraria: number;

  /**
   *
   */
  turma: any;
  /*-------------------------------------------------------------------
  *                           CONSTRUCTORS
  *-------------------------------------------------------------------*/

  /**
   *
   */
  constructor()
  {
  }

  /**
   * 
   */
  fornecedorCertificado = {
    TFC: "TFC",
    ORGANIZADOR: "ORGANIZADOR"
  };

  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/

  /**
   *
   */
  ngOnInit(): void
  {
    Broker.of("turmaService").promise("findProximaTurmaDisponivelByCursoId", this.curso.id)
      .then((result) =>
      {
        if (result)
        {
          this.turma = result;
          this.curso.proximaTurma = this.turma;
          Broker.of("turmaService").promise("findPrimeiraEUltimaAulaByTurmaId", this.turma.id)
            .then((result) =>
            {
              this.turma.aulas = result;
            });
        }
      });
  }

}
