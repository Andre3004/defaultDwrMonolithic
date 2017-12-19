import {Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, Renderer} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import 'rxjs/add/operator/toPromise';
import {textMasks} from '../../../../../controls/text-masks/text-masks';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {cnpjValidator, cpfValidator, dataNascimentoValidator} from "../../../../../controls/validators/Validators";

@Component({
  selector: 'usuario-pessoa-fisica-form',
  templateUrl: './usuario-pessoa-fisica-form.component.html',
  styleUrls: ['./usuario-pessoa-fisica-form.component.css']
})
export class UsuarioPessoaFisicaFormComponent implements OnInit, OnDestroy
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
  masks = textMasks;

  /**
   *
   * @type {{}}
   */
  @Input()
  usuario: any = {};

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
      cpf : new FormControl('cpf', [Validators.required, cpfValidator()]),
      registroGeral : new FormControl('registroGeral', Validators.required)
    });

    if (!this.form)
    {
      this.form = this.fb.group({});
    }

    this.form.addControl( 'pessoaFisica', formGroup);
  }

  /**
   *
   */
  ngOnDestroy():void
  {
    this.form.removeControl('pessoaFisica');
  }
}
