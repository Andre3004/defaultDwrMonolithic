import { Component, OnInit } from '@angular/core';
import { textMasks } from '../../../controls/text-masks/text-masks';
import { MatSnackBar } from '@angular/material';
import { Broker } from 'eits-ngx';
import { Router } from '@angular/router';
import * as moment from 'moment';
import {ToastyService} from "ng2-toasty";

@Component({
  selector: 'inserir-aluno',
  templateUrl: './inserir-aluno.component.html',
  styleUrls: ['./inserir-aluno.component.css']
})
export class InserirAlunoComponent implements OnInit
{

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/
  /**
   * Data de hoje
   * @type {Date}
   */
  today: Date = new Date();

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {{fileTransfer: any; foto: any; id: any; nome: any; email: any; password: any; confirmacaoPassword: any; documento: any; isEmpresa: boolean; endereco: {cidade: {nome: any}}}}
   */
  usuario: any = {
    fileTransfer: null,
    foto: null,
    id: null,
    nome: null,
    email: null,
    password: null,
    confirmacaoPassword: null,
    documento: null,
    documentoEstrangeiro: null,
    isEstrangeiro: false,
    tipoDocumentoEstrangeiro: null,
    isInstrutor: false,
    isEmpresa: false,
    endereco: {} 
  }


  /*-------------------------------------------------------------------
   *                           CONSTRUCTORS
   *-------------------------------------------------------------------*/
  /**
   *
   */
  constructor(public snackBar: MatSnackBar, public router: Router, public toastyService: ToastyService)
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
   *
   */
  public insertUsuario(): void
  {

    if (!moment(this.usuario.dataNascimento, "DD-MM-YYYY").isValid())
    {
      this.error("Data de nascimento inválida");
      this.toastyService.clearAll();
      return;
    }

    // Insere dados do usuario

    this.usuario.isInstrutor = false;
    if (this.usuario.documento)
    {
      this.usuario.documento = this.getNumbers(this.usuario.documento);
    }
    let foto = this.usuario.foto;
    this.usuario.foto = null;
    Broker.of("usuarioService").promise("insertUsuario", this.usuario)
      .then((result) =>
      {
        this.usuario.id = result.id;
        // Insere dados da foto do usuario somente se ele tem foto
        this.insertUsuarioFoto(this.usuario.fileTransfer);
      })
      .catch((exception) =>
      {
        if(foto)
          this.usuario.foto = foto;

        this.toastyService.clearAll();
        this.openSnackBar(exception.message);
      });
  }

  /**
   *
   * @param fileTransfer
   */
  public insertUsuarioFoto(fileTransfer: any)
  {
    Broker.of("usuarioService").promise("insertUsuarioFoto", fileTransfer, this.usuario.id)
      .then((result) =>
      {
        this.openSnackBar('Aluno inserido com sucesso');

        this.router.navigate(['/dashboard/alunos/' + this.usuario.id]);
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
  public error(message: string)
  {
    this.openSnackBar(message);
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
   * @param str
   */
  public getNumbers(str: string)
  {
    return str.replace(/[^0-9]/g, '');// Sobrescreve tudo o que nao é número com vazio
  }

}
