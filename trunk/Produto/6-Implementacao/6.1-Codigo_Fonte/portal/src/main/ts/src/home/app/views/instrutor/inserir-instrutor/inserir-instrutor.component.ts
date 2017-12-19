import { Component, OnInit } from '@angular/core';
import { textMasks } from '../../../controls/text-masks/text-masks';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Broker } from 'eits-ngx';
import * as moment from 'moment';
import {ToastyService} from "ng2-toasty";


@Component({
  selector: 'inserir-instrutor',
  templateUrl: './inserir-instrutor.component.html',
  styleUrls: ['./inserir-instrutor.component.css']
})
export class InserirInstrutorComponent implements OnInit
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
    isEmpresa: false,
    isInstrutor: true,
    endereco: {}
  };

  /*-------------------------------------------------------------------
   *                           CONSTRUCTORS
   *-------------------------------------------------------------------*/
  /**
   *
   */
  constructor(public snackBar: MatSnackBar, public router: Router, public toastService: ToastyService)
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
      this.toastService.clearAll();
      return;
    }

    this.usuario.documento = this.getNumbers(this.usuario.documento);

    let areasAtuacao = this.usuario.areasAtuacao;

    let foto = this.usuario.foto;
    this.usuario.foto = null;

    Broker.of("usuarioService").promise('insertInstrutor', this.usuario)
      .then((result) =>
      {
        this.usuario.id = result.id;

        Broker.of("usuarioService").promise("insertAreasAtuacao", this.usuario.id, areasAtuacao)
          .then((result) =>
          {
            // O entity graph não traz as áreas de atuação, o entity graph só traz uma lista.
            // A lista escolha foi a de áreas de interesse
            this.usuario.areasAtuacao = areasAtuacao;

            // Insere dados da foto do usuario somente se ele tem foto
            this.insertUsuarioFoto(this.usuario.fileTransfer);
          }).catch(exception => {
            this.toastService.clearAll();
          });
      })
      .catch((exception) =>
      {
        if(foto)
          this.usuario.foto = foto;
        this.toastService.clearAll();
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
        this.openSnackBar('Instrutor inserido com sucesso');

        this.router.navigate(['/dashboard/instrutores/' + this.usuario.id]);
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
