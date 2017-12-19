import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'text-highlight',
  templateUrl: './text-highlight.component.html',
  styleUrls: ['./text-highlight.component.css']
})
export class TextHighlightComponent implements OnInit {

  /**
   * 
   */
  @Input()
  color;

   /**
    * 
    */
  @Input()
  blockquote: boolean;

   /**
    * 
    */
  @Input()
  blockquoteColor: string = "";
  
  /**
   * 
   */
  backgroundColor: string;

  /**
   * 
   */
  textColor: string;


  /**
   * 
   */
  constructor() { }

  /**
   * 
   */
  ngOnInit() {
    this.backgroundColor= "bgc-" + this.color + "-100";
    this.textColor= "tc-" + this.color + "-800";
  }

}
