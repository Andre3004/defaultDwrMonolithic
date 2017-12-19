
import
{
  Directive,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  HostListener
} from '@angular/core';

@Directive({ selector: '[stopPropagation]' })
export class StopPropagationDirective
{ 
  /**
   * 
   * @param event 
   */
  @HostListener('click', ['$event'])
  onClick(event)
  {
    event.stopPropagation();
  }

  /**
   * 
   * @param event 
   */
  @HostListener('mousedown', ['$event'])
  onMouseDown(event)
  {
    event.stopPropagation();
  }
  
  /**
   * 
   * @param event 
   */
  @HostListener('mouseup', ['$event'])
  onMouseUp(event)
  {
    event.stopPropagation();
  }

   /**
   * 
   * @param event 
   */
  @HostListener('touchstart', ['$event'])
  onTouchStart(event)
  {
    event.stopPropagation();
  }

   /**
   * 
   * @param event 
   */
  @HostListener('touchend', ['$event'])
  onTouchEnd(event)
  {
    event.stopPropagation();
  }
}