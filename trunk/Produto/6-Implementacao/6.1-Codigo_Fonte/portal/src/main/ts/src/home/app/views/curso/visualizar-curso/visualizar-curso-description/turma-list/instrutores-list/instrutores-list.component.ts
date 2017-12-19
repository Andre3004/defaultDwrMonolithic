import { Component, OnInit, Input } from '@angular/core';
import { Broker } from "eits-ngx";

@Component({
  selector: 'instrutores-list',
  templateUrl: './instrutores-list.component.html',
  styleUrls: ['./instrutores-list.component.css']
})
export class InstrutoresListComponent implements OnInit
{
  /**
   *
   */
  @Input()
  turma: any;

  /**
   *
   */
  constructor() { }

  /**
   *
   */
  ngOnInit()
  {
    this.findInstrutoresByTurmaId(this.turma);
  }

  /**
   *
   * @param turma
   */
  public findInstrutoresByTurmaId(turma: any)
  {
    Broker.of("usuarioService").promise("findInstrutoresByTurmaId", turma.id, null)
      .then((result) =>
      {
        turma.instrutores = result.content;
        this.findinstrutoresFotoByUsuarioId(turma.instrutores);
      })
      .catch((message) =>
      {
        console.log(message);
      });
  }

  /**
   *
   * @param alunoId
   */
  public findinstrutoresFotoByUsuarioId(instrutores: any)
  {
    instrutores.forEach(
      instrutor =>
      {
        Broker.of("usuarioService").promise("findUsuarioFotoByUsuarioId", instrutor.usuario.id)
          .then((result) =>
          {
            instrutor.usuario.foto = result;
          })
          .catch((exception) =>
          {
            console.log(exception);
          });
      });
  }
}
