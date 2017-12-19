import { Directive, EventEmitter, Output, HostListener } from '@angular/core';

@Directive({
  selector: '[clickWithoutMove]'
})
export class ClickWithoutMoveDirective {

  @Output() onClickWithoutMove: EventEmitter<any> = new EventEmitter();

  public mouseMoved: boolean;
  public longPress: boolean;
  public timeOut: any;
  public duration: number = 50;

   @HostListener('mousedown', ['$event'])
   onMouseDown(event)
   {
     this.mouseMoved = false;
     this.longPress = false;
     let timeOut = setTimeout(() => {
       this.longPress = true;
     }, this.duration);
   }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event)
  {
    if(this.longPress){
      this.mouseMoved = true;
    }
  }

  @HostListener('mouseup' , ['$event'])
  onMouseUp(event) {
    clearTimeout(this.timeOut);

    if(!this.mouseMoved)
    {
      this.onClickWithoutMove.emit(event);
    }
  }
}
