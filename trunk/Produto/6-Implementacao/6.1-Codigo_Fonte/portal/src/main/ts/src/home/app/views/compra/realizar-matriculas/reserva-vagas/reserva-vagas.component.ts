import { MatSnackBar } from '@angular/material';
import { AuthenticatedUserService } from './../../../../controls/authenticated-user/authenticated-user.service';
import { Broker } from "eits-ngx";
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from "@angular/core";
import { textMasks } from "./../../../../controls/text-masks/text-masks";
import { Subscription } from "rxjs/Subscription";
import { ViewChild } from '@angular/core';
import { LotesListComponent } from '../../../../controls/lotes-list/lotes-list.component';

@Component({
  selector: 'reserva-vagas',
  templateUrl: './reserva-vagas.component.html',
  styleUrls: ['./reserva-vagas.component.css']
})
export class ReservaVagasComponent implements OnInit, OnDestroy
{
  /*-------------------------------------------------------------------
  *                           ATTRIBUTES
  *-------------------------------------------------------------------*/

  /**
   *
   */
  @Input()
  compra: any;

  /**
   *
   */
  @Input()
  turma: any;

  /**
   *
   */
  @Output()
  onComplete: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  @Output()
  onChange: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  @Output()
  onQuantidadeVagasChange: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  masks: any = textMasks;

  /**
   *
   */
  existsCpf: boolean;

  /**
   *
   */
  existsCnpj: boolean;

  /**
   *
   */
  quantidadeVagas: number;

  /**
   *
   */
  today = new Date();

  /**
   *
   */
  userSubscription: Subscription;

  /**
   *
   * @type {boolean}
   */
  foundUser: boolean = false;

  /**
   * 
   */
  identificadorCupom: String;

  /**
   * 
   */
  cupomDesconto: any;

  /**
   * 
   */
  @ViewChild('lotesList')
  lotesListComponent: LotesListComponent;

  /*-------------------------------------------------------------------
  *                           CONSTRUCTOR
  *-------------------------------------------------------------------*/

  /**
   *
   */
  constructor(public authenticatedUserService: AuthenticatedUserService, public snackBar: MatSnackBar)
  {
    this.userSubscription = authenticatedUserService.authenticatedUserChanged.subscribe((user) =>
    {
      this.compra.responsavel = user;
      this.foundUser = false
    });
  }

  /*-------------------------------------------------------------------
  *                           BEHAVIORS
  *-------------------------------------------------------------------*/

  /**
   *
   */
  ngOnInit()
  {
    this.getAuthenticatedUser();
    if (!this.compra.responsavel.tipoDocumentoEstrangeiro)
    {
      this.compra.responsavel.selectTipoDocumento = 'Passaporte';
      this.compra.responsavel.tipoDocumentoEstrangeiro = null;
    }
    else
    {
      if (this.compra.responsavel.tipoDocumentoEstrangeiro === 'Passaporte')
      {
        this.compra.responsavel.selectTipoDocumento = 'Passaporte';
      }
      else
      {
        this.compra.responsavel.selectTipoDocumento = 'Outro'
      }
    }
  }

  /**
   *
   */
  ngOnDestroy(): void
  {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

  /**
   *
   */
  submit(event: Event)
  {
    if (this.compra.responsavel.isEmpresa)
    {
      if (!(this.getNumbers(this.compra.responsavel.documento).length >= 12))
      {
        this.error('CNPJ inválido');
        return;
      }
    }
    else
    {
      if (!this.compra.responsavel.isEstrangeiro)
      {
        if (this.getNumbers(this.compra.responsavel.documento).length >= 12)
        {
          this.error('CPF inválido');
          return;
        }
      }
    }

    event.preventDefault();

    if (this.validaForm())
    {
      this.onComplete.emit();
    }
  }

  /**
   *
   */
  validaForm(): boolean
  {
    if (this.compra.responsavel.isEmpresa)
    {
      if (this.existsCnpj)
      {
        return false;
      }
    }
    else
    {
      if (this.existsCpf)
      {
        return false;
      }
    }

    if (!this.quantidadeVagas)
    {
      this.openSnackBar("Informe ao menos uma vaga");
      return false;
    }
    else if (this.quantidadeVagas > (this.turma.vagasDisponiveis))
    {
      this.openSnackBar("Limite de vagas excedido, máximo de " + (this.turma.vagasDisponiveis) + " vagas total na turma");

      return false;
    }
    else if (this.turma.lotes.filter(lote => lote.vagasDisponiveis < lote.quantidade).length)
    {
      this.openSnackBar("Limite de vagas do lote excedido ");

      return false;
    }
    else
    {
      return true;
    }
  }

  /**
   *
   */
  formChanged(): void
  {
    this.onChange.emit();
  }

  /**
   *
   * @param total
   * @param num
   * @returns {any}
   */
  getSum(total, num)
  {
    return total + num;
  }

  /**
   *
   */
  quantidadeVagasChanged(): void
  {

    let precos = this.turma.lotes.map(function (lote) { return lote.preco * lote.quantidade ? lote.preco * lote.quantidade : 0; });
    let quantidadeVagas = this.turma.lotes.map(function (lote) { return lote.quantidade ? lote.quantidade : 0; });

    this.quantidadeVagas = quantidadeVagas.reduce(this.getSum);

    const event = {
      vagasOcupadas: this.quantidadeVagas,
      valor: precos.reduce(this.getSum)
    };

    this.onQuantidadeVagasChange.emit(event);
  }

  /**
   *
   */
  findByDocumentoOrEmailOrRegistroGeral(fromDocumento)
  {
    let documento = this.getNumbers(this.compra.responsavel.documento);
    Broker.of("usuarioService").promise("findByDocumentoOrEmailOrRegistroGeral", documento, this.compra.responsavel.email, this.compra.responsavel.registroGeral)
    Broker.of("usuarioService").promise("findByDocumentoOrEmailOrRegistroGeral", documento, this.compra.responsavel.email, this.compra.responsavel.registroGeral)
      .then((result) =>
      {
        if (result)
        {
          this.setCompraResponsavel(result);
        }
        else
        {
          this.foundUser = false;
        }
      })
      .catch((message) =>
      {
        console.log(message);
      });
  }

  /**
   * 
   */
  public findByDocumentoEstrangeiro(documento)
  {
    if (this.compra.responsavel.selectTipoDocumento = 'Passaporte')
    {
      this.compra.responsavel.tipoDocumentoEstrangeiro = 'Passaporte';
    }
    Broker.of("usuarioService").promise("findByDocumentoEstrangeiro", this.compra.responsavel.tipoDocumentoEstrangeiro, documento)
      .then((result) =>
      {
        if (result)
        {
          this.setCompraResponsavel(result);
        }
        else
        {
          this.foundUser = false;
        }
      })
      .catch((message) =>
      {
        console.log(message);
      });


  }

  /**
   *
   */
   setCompraResponsavel(usuario)
   {
    this.foundUser = true;
    this.compra.responsavel.documento = usuario.documento;
    this.compra.responsavel.id = usuario.id;
    this.compra.responsavel.nome = usuario.nome;
    this.compra.responsavel.registroGeral = usuario.registroGeral;
    this.compra.responsavel.isEmpresa = usuario.isEmpresa;
    this.compra.responsavel.email = usuario.email;
    this.compra.responsavel.tipoDocumentoEstrangeiro = usuario.tipoDocumentoEstrangeiro;
    this.compra.responsavel.documentoEstrangeiro = usuario.documentoEstrangeiro;
    this.compra.responsavel.documentoEstrangeiro = usuario.documentoEstrangeiro;
    this.compra.responsavel.isEstrangeiro = usuario.isEstrangeiro;
    if (this.compra.responsavel.tipoDocumentoEstrangeiro === 'Passaporte')
    {
      this.compra.responsavel.selectTipoDocumento = 'Passaporte';
    }
    else
    {
      this.compra.responsavel.selectTipoDocumento = 'Outro'
    }
   }
   /**
    * 
    */

  getNumbers(str: string)
  {
    if (str == null) return null;
    return str.replace(/[^0-9]/g, '');// Sobrescreve tudo o que nao é número com nada
  }

  /**
   *
   */
  public getAuthenticatedUser(): void
  {
    this.authenticatedUserService.getPromiseAuthenticatedUser()
      .then((result) =>
      {
        if (result)
        {
          this.compra.responsavel = result;
        }
      })
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
   */
  public findCupomByIdentificador()
  {
    Broker.of("compraService").promise("findCupomByIdentificadorAndTurmaId", this.identificadorCupom, this.turma.id)
    .then((result) =>
    {
      this.compra.cupomDesconto = result;
    })
    .catch((message) =>
    {
      this.openSnackBar(message.message);
      console.log(message);
    });
  }

  /**
   * 
   */
  public removeCupom()
  {
    this.compra.cupomDesconto = null;
    this.identificadorCupom = null;
  }

  /**
   * 
   */
  public clearLotesList()
  {
    this.lotesListComponent.clearLotesList();
  }
}
