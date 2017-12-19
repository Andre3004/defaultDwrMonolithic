import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'home-container',
  templateUrl: './home-container.component.html',
  styleUrls: ['./home-container.component.css']
})
export class HomeContainerComponent implements OnInit {

  @Input()
  maxWidth: string = '1366px';
  
  constructor() { }

  ngOnInit() {
  }

}
