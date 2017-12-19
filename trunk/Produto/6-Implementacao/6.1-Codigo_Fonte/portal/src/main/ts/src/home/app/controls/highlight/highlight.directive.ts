import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[highlight]'
})
export class HighlightDirective
{
  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /*-------------------------------------------------------------------
   *                           CONSTRUCTORS
   *-------------------------------------------------------------------*/
  /**
   *
   * @param el
   */
  constructor(public el: ElementRef) { }

   /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/

  /**
   *
   */
  @HostListener('mouseenter') onMouseEnter()
  {
    this.highlight("box-shadow: 0px 10px 13px -6px rgba(0, 0, 0, 0.2), 0px 20px 31px 3px rgba(0, 0, 0, 0.14), 0px 8px 38px 7px rgba(0, 0, 0, 0.12);");
  }
  /**
   *
   */
  @HostListener('mouseleave') onMouseLeave()
  {
    this.highlight(null);
  }

  /**
   *
   * @param style
   */
  public highlight( style : string)
  {
    this.el.nativeElement.style = style;
  }

}
