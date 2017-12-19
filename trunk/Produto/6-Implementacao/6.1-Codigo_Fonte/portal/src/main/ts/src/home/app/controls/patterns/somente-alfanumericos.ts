import {NgModel} from "@angular/forms";
import {Directive} from "@angular/core";

@Directive({
  selector: '[ngModel][somenteAlfanumericos]',
  providers: [NgModel],
  host: {
    '(ngModelChange)' : 'onInputChange($event)'
  }
})
export class SomenteAlfanumericos{
  constructor(public model:NgModel){}

  onInputChange(event){
    if (event && event.match(/[&\/\\#,_\-|+()$~^´`@¨=%.'";:*?!§¬¢£³²¹ºª<>{}[\]]/g))
      this.model.valueAccessor.writeValue(event.replace(/[&\/\\#,_\-|+()$~^´`@¨=%.'";:*?!§¬¢£³²¹ºª<>{}[\]]/g, ''));
  }
}
