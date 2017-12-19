import {NgModel} from "@angular/forms";
import {Directive} from "@angular/core";

@Directive({
  selector: '[ngModel][somenteLetras]',
  providers: [NgModel],
  host: {
    '(ngModelChange)' : 'onInputChange($event)'
  }
})
export class SomenteLetras{
  constructor(public model:NgModel){}

  onInputChange(event){
    if (event && event.match(/[&\/\\#,_\|+()$~^´`@¨=%.";:*?!§¬¢£³²¹ºª<>{}[\]1234567890]/g)) {
      this.model.valueAccessor.writeValue(event.replace(/[&\/\\#,_\|+()$~^´`@¨=%.";:*?!§¬¢£³²¹ºª<>{}[\]1234567890]/g, ''));
    }
  }
}
