import { MatDialog, MatSnackBar } from '@angular/material';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConsultarLotesComponent } from "./consultar-lotes/consultar-lotes.component";
import { Broker } from "eits-ngx";


@Component({
  selector: 'lote-view',
  templateUrl: './lote-view.component.html',
  styleUrls: ['./lote-view.component.css']
})
export class LoteViewComponent implements OnInit
{

  /*-------------------------------------------------------------------
     *                           ATTRIBUTES
     *-------------------------------------------------------------------*/

  /**
   *
   */
  @ViewChild(ConsultarLotesComponent)
  consultarLotesComponent;

  /**
   *
   */
  @Input()
  turma: any;

  /**
   *
   */
  @Output()
  onContinue: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  loteToUpdate: any;

  /**
   *
   */
  loteToInsert: any;

  /*-------------------------------------------------------------------
  *                           CONSTRUCTOR
  *-------------------------------------------------------------------*/
  /**
   *
   * @param dialog
   */
  constructor(public dialog: MatDialog, public activatedRoute: ActivatedRoute, public snackBar: MatSnackBar)
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
    Broker.of("turmaService").promise("listLotesByTurmaId", this.turma.id, null)
      .then((result) =>
      {
        if (!result.content.length)
        {
          this.initLoteToInsert();
        }
      })
      .catch((exception) =>
      {
        this.openSnackBar("Não foi possível consultar os lotes desta turma");
      });
  }

  /**
   *
   */
  public listLotesByTurmaId()
  {
    this.consultarLotesComponent.listLotesByTurmaId();
  }

  /**
   *
   */
  public continue(): void
  {
    if (this.consultarLotesComponent.lotes && this.consultarLotesComponent.lotes.length)
    {
      this.onContinue.emit();
    }
    else
    {
      this.openSnackBar("Você deve cadastrar ao menos um lote");
    }
  }

  /**
   *
   */
  public initLoteToUpdate(lote: any)
  {
    if (!this.loteToInsert && !this.loteToUpdate)
    {
      this.loteToUpdate = lote;
      this.loteToUpdate.turma = this.turma; // Seta o bind da turma atual
    }
    else
    {
      this.openSnackBar("Antes você deve finalizar ou cancelar o formulário atual.");
    }
  }

  /**
   *
   */
  public resetLoteToUpdate()
  {
    this.loteToUpdate = null;
    this.consultarLotesComponent.listLotesByTurmaId();
  }

  /**
   *
   */
  public initLoteToInsert()
  {
    this.loteToInsert = {
      turma: this.turma,
      inicio: null,
      termino: null,
    }
  }

  /**
   *
   */
  public resetLoteToInsert()
  {
    this.loteToInsert = null;
    this.consultarLotesComponent.listLotesByTurmaId();
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
   * @param lote
   */
  public removeLote(lote: any)
  {
    if (!this.loteToInsert && !this.loteToUpdate)
    {
      Broker.of("turmaService").promise("removeLote", lote.id)
        .then(() =>
        {
          this.openSnackBar('Lote removido com sucesso');
          this.consultarLotesComponent.listLotesByTurmaId();
        })
        .catch((exception) =>
        {
          console.log(exception.message);
        })
    }
    else
    {
      this.openSnackBar("Antes você deve finalizar ou cancelar o formulário atual.");
    }
  }
}
