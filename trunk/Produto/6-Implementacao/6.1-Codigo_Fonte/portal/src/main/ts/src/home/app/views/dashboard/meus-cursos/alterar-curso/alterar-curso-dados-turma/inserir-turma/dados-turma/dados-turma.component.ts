import {MatDialog, MatSnackBar} from '@angular/material';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Broker} from 'eits-ngx';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import {CadastrarInstrutorDialogComponent} from "./cadastrar-instrutor-dialog/cadastrar-instrutor-dialog.component";


@Component({
  selector: 'dados-turma',
  templateUrl: './dados-turma.component.html',
  styleUrls: ['./dados-turma.component.css']
})
export class DadosTurmaComponent implements OnInit
{
  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/
  /**
   *
   */
  @Input()
  turma : any = {
    tipoTurma: 'PRESENCIAL',
    quantidadeVagas: null,
    endereco: {
      cidade: {
        nome: null
      }
    },
    instrutores: []
  };

  /**
   *
   */
  public instrutoresSelected: any = [];

  /**
   *
   */
  public instrutoresList: any[];

  /**
   *
   */
  @Output()
  onSave: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  @Output()
  onCancel: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  @Output()
  onContinue: EventEmitter<any> = new EventEmitter();

  /*-------------------------------------------------------------------
   *                           VALIDATORS
   *-------------------------------------------------------------------*/
  /**
   *
   * @type {FormControl}
   */
  quantidadeVagas = new FormControl('', [Validators.required, Validators.min(1)]);

  /**
   *
   * @type {FormControl}
   */
  minimoMatriculas = new FormControl('', [Validators.required, Validators.min(1), Validators.max(this.turma.quantidadeVagas)]);

  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/
  /**
   *
   * @param dialog
   */
  constructor(public activatedRoute: ActivatedRoute, public snackBar: MatSnackBar, public router: Router, public dialog: MatDialog)
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
    if (this.turma.instrutores.length)
    {

      this.instrutoresSelected = [];
      for (let instrutor of this.turma.instrutores)
      {
        this.instrutoresSelected.push(instrutor.usuario)
      }
      this.getFotoInstrutores(this.instrutoresSelected);
    }
  }

  /**
   *
   */
  public submit(event: Event)
  {
    event.preventDefault();

    let instrutoresList = [];

    for (let instrutor of this.instrutoresSelected)
    {
      let instrutorSelected: any = {};
      for (let instrutorTurma of this.turma.instrutores)
      {
        if (instrutorTurma.usuario.id == instrutor.id)
          instrutorSelected.id = instrutorTurma.id
      }
      instrutoresList.push({
        'id': instrutorSelected.id,
        'turma': this.turma,
        'usuario': instrutor
      });
    }

    this.turma.instrutores = instrutoresList;

    if (this.turma.tipoTurma === 'DISTANCIA') delete this.turma.endereco;
    this.onSave.emit();
    this.continue()
  }

  /**
   *
   */
  public cancelar()
  {
    this.onCancel.emit();
  }

  /**
   *
   */
  public continue()
  {
    this.onContinue.emit();
  }
  /**
   *
   */
  public listInstrutoresByFilters(filter: String)
  {
    //Criar array com ids para não requisitar estes instrutores
    let instrutoresIds = null;
    for (let instrutor of this.instrutoresSelected)
    {
      if (!instrutoresIds)
        instrutoresIds = [];

      instrutoresIds.push(instrutor.id);
    }

    Broker.of("turmaService").promise("listInstrutoresByFilters", filter, instrutoresIds, { size: 50, page: 0, sort: null })
      .then((result) =>
      {
        this.instrutoresList = result.content;
      })
      .catch((exception) =>
      {
        console.log(exception);
      })
  }

  /**
   *
   * @param instrutores
   */
  public getFotoInstrutores(instrutores: any[])
  {
    instrutores.forEach(
      instrutor =>
      {
        this.getFotoInstrutor(instrutor);
      }
    )
  }

  /**
   *
   * @param instrutor
   */
  public getFotoInstrutor(instrutor: any)
  {
    Broker.of("usuarioService").promise("findUsuarioFotoByUsuarioId", instrutor.id)
      .then((result) =>
      {
        instrutor.foto = result;
      });
  }

  public cadastrarInstrutor()
  {
    let dialogRef = this.dialog.open(CadastrarInstrutorDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(instrutor =>
    {
      if (instrutor)
      {
        this.instrutoresSelected.push(instrutor);
      }
    });
  }

}
