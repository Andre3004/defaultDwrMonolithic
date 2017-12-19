import { Component, Input, OnInit, AfterViewInit, ChangeDetectorRef } from "@angular/core";

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit, AfterViewInit {

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  @Input()
  endereco: any;

  /**
   *
   */
  viewLoaded: boolean = false;

  /**
   *
   */
  @Input()
  mapHeight: string = "300px";

  /*-------------------------------------------------------------------
  *                           CONSTRUCTOR
  *-------------------------------------------------------------------*/

  /**
   *
   * @param changeDetectionRef
   */
  constructor(public changeDetectionRef : ChangeDetectorRef) {
  }

  /*-------------------------------------------------------------------
  *                           BEHAVIORS
  *-------------------------------------------------------------------*/

  /**
   *
   */
  ngOnInit() {
  }

  /**
   *
   */
  ngAfterViewInit()
  {
    this.viewLoaded = true;
    this.changeDetectionRef.detectChanges();
  }
}
