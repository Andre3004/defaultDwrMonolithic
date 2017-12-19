import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from "@angular/material";
import { TermosUsoDialogComponent } from "./termos-uso-dialog/termos-uso-dialog.component";
import {FormBuilder, FormGroup} from "@angular/forms";
@Component({
  selector: 'termos-uso',
  templateUrl: './termos-uso.component.html',
  styleUrls: ['./termos-uso.component.css']
})
export class TermosUsoComponent implements OnInit
{
  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/
  /**
   *
   */
  @Input() form: any;
  /**
   *
   */
  @Input()
  public termosUso : any = {
    isAccepted : false
  };

  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/

  /**
   *
   * @param dialog
   */
  constructor(public dialog: MatDialog, public fb: FormBuilder) { }

  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/

  /**
   *
   */
  ngOnInit()
  {
    const formGroup = new FormGroup({});

    if (!this.form) {
      this.form = this.fb.group({});
    }

    this.form.addControl('termosUso', formGroup);
  }

  /**
   *
   */
  public openTermosUsoDialog()
  {
    let dialogRef = this.dialog.open(TermosUsoDialogComponent);

    dialogRef.afterClosed().subscribe(result =>
    {
      if(result){
        this.termosUso.isAccepted = result;
      }
    });
  }
}
