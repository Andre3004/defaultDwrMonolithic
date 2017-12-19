import {MatSnackBar} from '@angular/material';
import 'rxjs/add/operator/toPromise';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {confirmPassword, password} from "../../../../../controls/validators/Validators";
import {Component, Input, OnDestroy, OnInit} from "@angular/core";

@Component({
  selector: 'password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.css']
})
export class PasswordFormComponent implements OnInit, OnDestroy
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
   * @type {{}}
   */
  @Input() usuario: any = {};

  /*-------------------------------------------------------------------
   *                           VALIDATORS
   *-------------------------------------------------------------------*/

  /*-------------------------------------------------------------------
   *                           CONSTRUCTORS
   *-------------------------------------------------------------------*/
  /**
   *
   */
  constructor(public snackBar: MatSnackBar, public fb: FormBuilder)
  {
  }

  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/

  /**
   *
   */
  ngOnInit()
  {
    const formGroup = new FormGroup({
      password: new FormControl('password', [Validators.required, password()]),
      confirmacaoPassword: new FormControl('confirmacaoPassword', [Validators.required, confirmPassword()])
    });

    if (!this.form) {
      this.form = this.fb.group({});
    }

    this.form.addControl('password', formGroup);
  }

  /**
   *
   */
  ngOnDestroy(): void
  {
    this.form.removeControl('password');
  }
}
