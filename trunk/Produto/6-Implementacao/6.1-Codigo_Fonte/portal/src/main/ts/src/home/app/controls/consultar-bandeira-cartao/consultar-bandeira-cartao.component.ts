import { Component, OnInit, Input } from '@angular/core';
import { Broker } from 'eits-ngx';

@Component({
  selector: 'consultar-bandeira-cartao',
  templateUrl: './consultar-bandeira-cartao.component.html',
  styleUrls: ['./consultar-bandeira-cartao.component.css']
})
export class ConsultarBandeiraCartaoComponent implements OnInit
{

  /**
   * 
   */
  @Input()
  numeroCartao: number;

  /**
   * 
   */
  endNumeroCartao: number;

  /**
   * 
   */
  bandeira: string;

  /**
   * 
   */
  urlPrefix: string = "/static/images/"

  bandeiras: any = {
    MASTERCARD: { brand: "MASTERCARD", url: this.urlPrefix+"mastercard.png" },
    VISA: { brand: "VISA", url: this.urlPrefix+"visa.png" },
    ELO: { brand: "ELO", url: this.urlPrefix+"elo.png" },
    DINERS: { brand: "DINERS", url: this.urlPrefix+"diners.ong" },
    AMERICAN_EXPRESS: { brand: "AMERICAN_EXPRESS", url: this.urlPrefix+"american-express.png" },
    HIPERCARD: { brand: "HIPERCARD", url: this.urlPrefix+"hipercard.png" },
    HIPER: { brand: "HIPER", url: this.urlPrefix+"hiper.png" },
    UNKNOWN: { brand: "UNKNOWN", url: null }
  }
  

  constructor() { }

  ngOnInit()
  {
    this.endNumeroCartao = this.numeroCartao % 10000;// return last 4 digits
    this.consultarBandeiraCartao(this.numeroCartao);
  }

  /**
   * 
   */
  consultarBandeiraCartao(numeroCartao: number)
  {
    Broker.of("compraService").promise("consultarBandeiraCartao", numeroCartao)
      .then((result) => 
      {
        if (result)
        {
          switch (result)
          {
            case this.bandeiras.MASTERCARD.brand:
              this.bandeira = this.bandeiras.MASTERCARD.url;
              break;
            case this.bandeiras.VISA.brand:
              this.bandeira = this.bandeiras.VISA.url;
              break;
            case this.bandeiras.ELO.brand:
              this.bandeira = this.bandeiras.ELO.url;
              break;
            case this.bandeiras.DINERS.brand:
              this.bandeira = this.bandeiras.DINERS.url;
              break;
            case this.bandeiras.AMERICAN_EXPRESS.brand:
              this.bandeira = this.bandeiras.AMERICAN_EXPRESS.url;
              break;
            case this.bandeiras.HIPERCARD.brand:
              this.bandeira = this.bandeiras.HIPERCARD.url;
              break;
            case this.bandeiras.HIPER.brand:
              this.bandeira = this.bandeiras.HIPER.url;
              break;
            case this.bandeiras.UNKNOWN.brand:
              this.bandeira = this.bandeiras.UNKNOWN.url;
              break;
          }
        }
      })
  }

}
