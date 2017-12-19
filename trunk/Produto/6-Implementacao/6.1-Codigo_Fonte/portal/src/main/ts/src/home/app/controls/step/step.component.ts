import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.css']
})
export class StepComponent implements OnInit
{
  /**
   * 
   */
  @Input()
  number: number;

  /**
   * 
   */
  @Input()
  active: boolean;

  /**
   * 
   */
  @Input()
  disabled: boolean;

  /**
   * 
   */
  @Input()
  colorActive: string = "green";

  /**
   * 
   */
  @Input()
  complete: boolean;

  /**
   * 
   */
  @Input()
  label: string;

  /**
   * 
   */
  @Input()
  textColor: string = "grey";

  /**
   * 
   */
  colorDefault: string = "bgc-grey-500";

  constructor() { }

  ngOnInit()
  {
    this.colorActive = "bgc-"+this.colorActive+"-A200";
    this.textColor = "tc-"+this.textColor+"-50";
  }

}
