import {Pipe, PipeTransform} from "@angular/core";
import {CurrencyPipe} from "@angular/common";

@Pipe({
  name: 'currencyformat'
})
export class CurrencyFormatPipe implements PipeTransform {

  transform(value: number, currencyCode: string = 'BRL', symbolDisplay: "symbol"| "symbol-narrow" | "code" , digits?: string): string {
    let currencyPipe: CurrencyPipe = new CurrencyPipe('pt-BR');

    if(!value || value < 0){
      value = 0;
    }
    let newValue: string = currencyPipe.transform(value, currencyCode, symbolDisplay, digits);

    return newValue;
  }

}
