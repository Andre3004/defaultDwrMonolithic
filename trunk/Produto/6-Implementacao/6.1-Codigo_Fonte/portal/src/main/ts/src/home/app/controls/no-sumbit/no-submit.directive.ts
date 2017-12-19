import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[noSubmit]'
})
export class NoSubmitDirective {

  constructor() { }

  @Input() keyCode: number = 13;

  /**
   * 
   * @param event 
   */
  @HostListener('keypress', ['$event'])
  onClick(event)
  {
   if(event.keyCode === this.keyCode)
      {
        event.preventDefault();
      }
  }

}
