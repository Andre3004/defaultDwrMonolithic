import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AulaViewComponent } from "./aulas/aula-view.component";
import { LoteViewComponent } from "./lotes/lote-view.component";
import { MatStepper } from '@angular/material';

@Component({
  selector: 'turma-form',
  templateUrl: './turma-form.component.html',
  styleUrls: ['./turma-form.component.css']
})
export class TurmaFormComponent implements OnInit
{
  /**
   *
   */
  @Input()
  turma: any;

  /**
   *
   * @type {EventEmitter<any>}
   */
  @Output()
  onSave: EventEmitter<any> = new EventEmitter();

  /**
   *
   * @type {EventEmitter<any>}
   */
  @Output()
  onCancel: EventEmitter<any> = new EventEmitter();

  /**
   *
   * @type {EventEmitter<any>}
   */
  @Output()
  onComeBack: EventEmitter<any> = new EventEmitter();

  /**
   *
   * @type {EventEmitter<any>}
   */
  @Output()
  onRemove: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  @ViewChild(AulaViewComponent)
  aulaViewComponent: AulaViewComponent;

  /**
   *
   */
  @ViewChild(LoteViewComponent)
  loteViewComponent: LoteViewComponent;

  /**
   *
   * @param {Router} router
   * @param {ActivatedRoute} activatedRoute
   */
  constructor(public router: Router, public activatedRoute: ActivatedRoute) { }

  /**
   *
   */
  ngOnInit()
  {
  }

  /**
   *
   */
  public save(stepper: MatStepper): void
  {
    this.onSave.emit();
    stepper.selectedIndex = 1;
  }

  /**
   *
   */
  public cancel(): void
  {
    this.onCancel.emit();
  }

  /**
   *
   */
  public comeBack(): void
  {
    this.onComeBack.emit();
  }

  /**
   *
   */
  public remove(): void
  {
    this.onRemove.emit();
  }
}
