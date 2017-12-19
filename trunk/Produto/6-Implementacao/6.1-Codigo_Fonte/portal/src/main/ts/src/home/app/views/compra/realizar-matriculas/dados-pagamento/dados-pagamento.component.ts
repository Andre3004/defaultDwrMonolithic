import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { textMasks } from "./../../../../controls/text-masks/text-masks";
import { MatSnackBar } from "@angular/material";
import { Broker } from 'eits-ngx';
import * as moment from 'moment';

@Component({
  selector: 'dados-pagamento',
  templateUrl: './dados-pagamento.component.html',
  styleUrls: ['./dados-pagamento.component.css']
})
export class DadosPagamentoComponent implements OnInit, AfterViewInit
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
  masks = textMasks;

  /**
   *
   */
  codigoSeguranca: string;

  /**
   *
   */
  termosUso: any;

  /**
   *
   */
  cardCredit = {
    valid: true
  };

  /**
   * 
   */
  parcelamentoOptions: any;

  /*-------------------------------------------------------------------
  *                           CONSTRUCTORS
  *-------------------------------------------------------------------*/

  /**
   *
   */
  constructor(public snackBar: MatSnackBar, public changeDetectionRef: ChangeDetectorRef)
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
    this.compra.pagamento = { endereco: {} };

    this.termosUso = { isAccepted: false };

    this.compra.pagamento.parcelas = "1";
  }

  /**
   *
   */
  submit(event: Event): void
  {
    if (!this.compra.pagamento.formaPagamento) this.compra.pagamento.formaPagamento = 'BOLETO';

    if (this.compra.pagamento.formaPagamento == 'CARTAO')
    {
      if (this.compra.pagamento.isEmpresa)
      {
        if (!(this.getNumbers(this.compra.pagamento.documentoTitularCartao).length >= 12))
        {
          this.error('CNPJ inválido');
          return;
        }
      }
      else
      {
        if (this.getNumbers(this.compra.pagamento.documentoTitularCartao).length >= 12)
        {
          this.error('CPF inválido');
          return;
        }
      }

      let momentDataNascimento = moment(this.compra.pagamento.dataNascimentoTitularCartao, "DD-MM-YYYY");

      if (!momentDataNascimento.isValid() || this.compra.pagamento.dataNascimentoTitularCartao.length < 8)
      {
        this.error('Data de nascimento inválida');
        return;
      }
      if (momentDataNascimento.isBefore(new Date("01/01/1500")))
      {
        this.error('Data de nascimento inválida');
        return;
      }
      if (momentDataNascimento.isAfter(Date.now()))
      {
        this.error('Data de nascimento inválida');
        return;
      }
    }

    if (this.compra.pagamento.dataNascimentoTitularCartao)
      this.compra.pagamento.dataNascimentoTitularCartao = moment(this.compra.pagamento.dataNascimentoTitularCartao, "DD/MM/YYYY").format("DD/MM/YYYY");

    event.preventDefault();//Previnir que nao irá atualizar a página

    if (!this.termosUso.isAccepted)
    {
      this.termosUso.requiredError = true;
    }
    else
    {
      if (this.compra.pagamento.formaPagamento === "BOLETO") // caso for boleto não deve salvar as informações de cartão
      {
        delete this.compra.pagamento.numeroCartao;
        delete this.compra.pagamento.mesValidade;
        delete this.compra.pagamento.anoValidade;
        delete this.compra.pagamento.nomeTitularCartao;
        delete this.compra.pagamento.documentoTitularCartao;
        delete this.compra.pagamento.isEmpresaTitularCartao;
        delete this.compra.pagamento.codigoSeguranca;
        this.compra.pagamento.parcelas = 1;
        this.onComplete.emit();
      }
      else if (this.compra.pagamento.formaPagamento == "CARTAO") // caso for cartão deve gerar o token do cartão antes de enviar
      {
        Broker.of("configuracaoService").promise("getChavePublica")
          .then((result) =>
          {
            var Moip = window['Moip'];
            var cc = new Moip.CreditCard({
              number: this.compra.pagamento.numeroCartao,
              cvc: this.compra.pagamento.codigoSeguranca,
              expMonth: this.compra.pagamento.mesValidade,
              expYear: this.compra.pagamento.anoValidade,
              pubKey: result
            });
            if (cc.isValid())
            {
              this.compra.pagamento.hash = cc.hash();
              this.onComplete.emit();
              this.cardCredit.valid = true;
            }
            else
            {
              this.cardCredit.valid = false;
            }
          })
          .catch((exception) =>
          {
            this.openSnackBar(exception.message);
          });
      }
    }
  }

  /**
   *
   */
  public onCompleteEmit()
  {
    this.onComplete.emit();
  }

  /**
  *
  * @param message
  */
  openSnackBar(message: string)
  {
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }

  /**
 * Precisa de outro ciclo de verificação
 * depois de iniciar a interface, para verificar
 * o bind o elemento do nome, caso isso não seja feito
 * estoura um excessão somente no ambiente de desenvolvimento
 */
  ngAfterViewInit(): void
  {
    this.changeDetectionRef.detectChanges();
  }

  /**
   *
   */
  getNumbers(str: string)
  {
    return str.replace(/[^0-9]/g, '');// Sobrescreve tudo o que nao é número com nada
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
   * @param amount 
   */
  public getParcelas(amount: number)
  {
    Broker.of("compraService").promise("getParcelas", amount)
      .then((result) =>
      {
        if (result)
        {
          this.parcelamentoOptions = result;
        }
      })
      .catch((exception) =>
      {
        this.openSnackBar(exception.message);
      });
  }
}
