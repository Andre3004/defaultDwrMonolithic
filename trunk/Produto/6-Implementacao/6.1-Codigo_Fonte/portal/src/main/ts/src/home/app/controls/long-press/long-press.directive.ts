
import
{
  Directive,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  HostListener
} from '@angular/core';

@Directive({ selector: '[longPress]' })
export class LongPressDirective
{

  @Input() duration: number = 500;

  @Output() onShortPress: EventEmitter<any> = new EventEmitter();
  @Output() onLongPress: EventEmitter<any> = new EventEmitter();
  @Output() onLongPressing: EventEmitter<any> = new EventEmitter();
  @Output() onLongPressEnd: EventEmitter<any> = new EventEmitter();

  public pressing: boolean;
  public longPressing: boolean;
  public shortPressing: boolean;
  public timeout: any;
  public mouseX: number = 0;
  public mouseY: number = 0;

  @HostBinding('class.press')
  get press() { return this.pressing; }

  @HostBinding('class.longpress')
  get longPress() { return this.longPressing; }

   @HostListener('mousedown', ['$event'])
   onMouseDown(event)
   {
     // don't do right/middle clicks
     if (event.which !== 1){
       return;
     }

     this.mouseX = event.clientX;
     this.mouseY = event.clientY;

     this.pressing = true;
     this.shortPressing = true;
     this.longPressing = false;

     this.timeout = setTimeout(() =>
     {
       this.longPressing = true;
       this.shortPressing = false;
       this.onLongPress.emit(event);
       this.loop(event);
     }, this.duration);

     this.loop(event);
   }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event)
  {
    if (this.pressing && !this.longPressing)
    {
      const xThres = (event.clientX - this.mouseX) > 10;
      const yThres = (event.clientY - this.mouseY) > 10;
      if (xThres || yThres)
      {
        this.endPress(event);
      }
    }
  }


  loop(event)
  {
    if (this.longPressing)
    {
      this.timeout = setTimeout(() =>
      {
        this.onLongPressing.emit(event);
        this.loop(event);
      }, 50);
    }
  }

  endPress(event: Event)
  {
    clearTimeout(this.timeout);

    this.shortPressing = false;
    this.longPressing = false;
    this.pressing = false;
    this.onLongPressEnd.emit(true);
  }

  @HostListener('mouseup' , ['$event'])
  onMouseUp(event) {
    if(this.shortPressing)
    {
      this.onShortPress.emit(event);
    }
    this.endPress(event);
  }

  /*-------------------------------------------------------------------
   *                           MOBILE
   *-------------------------------------------------------------------*/

    public Touching: boolean;
    public longTouching: boolean;
    public shortTouching: boolean;
    public timeoutMobile: any;
    public touchX: number = 0;
    public touchY: number = 0;

   @HostListener('touchstart', ['$event'])
   onTouchStart(event)
   {
     this.touchX = event.clientX;
     this.touchY = event.clientY;

     this.Touching = true;
     this.shortTouching = true;
     this.longTouching = false;

     this.timeoutMobile = setTimeout(() =>
     {
       this.shortTouching = false;
       this.longTouching = true;
       this.onLongPress.emit(event);
       this.loopMobile(event);
     }, this.duration);

     this.loopMobile(event);
   }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event)
  {
    if (this.Touching && !this.longTouching)
    {
      const xThres = (event.clientX - this.touchX) > 10;
      const yThres = (event.clientY - this.touchY) > 10;
      if (xThres || yThres)
      {
        this.endPressMobile(event);
      }
    }
  }


  loopMobile(event)
  {
    if (this.longTouching)
    {
      this.timeoutMobile = setTimeout(() =>
      {
        this.onLongPressing.emit(event);
        this.loop(event);
      }, 50);
    }
  }

  endPressMobile(event: Event)
  {
    clearTimeout(this.timeoutMobile);
    this.shortTouching = false;
    this.longTouching = false;
    this.Touching = false;
    this.onLongPressEnd.emit(true);
  }

  @HostListener('touchend' , ['$event'])
  onTouchEnd(event) {
    if(this.shortTouching)
    {
      this.onShortPress.emit(event);
    }
    this.endPressMobile(event);
  }

}
