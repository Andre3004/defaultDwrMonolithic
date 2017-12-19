import {Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, Renderer} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import 'rxjs/add/operator/toPromise';
import {textMasks} from '../../../../../controls/text-masks/text-masks';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {cnpjValidator, cpfValidator, dataNascimentoValidator} from "../../../../../controls/validators/Validators";

@Component({
  selector: 'usuario-pessoa-juridica-form',
  templateUrl: './usuario-pessoa-juridica-form.component.html',
  styleUrls: ['./usuario-pessoa-juridica-form.component.css']
})
export class UsuarioPessoaJuridicaFormComponent implements OnInit, OnDestroy
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
      documentoRepresentante : new FormControl('documentoRepresentante', [Validators.required, cpfValidator()]),
      cnpj : new FormControl('cnpj', [Validators.required, cnpjValidator()]),
      registroGeralRepresentante : new FormControl('registroGeralRepresentante', Validators.required)
    });

    if (!this.form)
    {
      this.form = this.fb.group({});
    }

    this.form.addControl( 'pessoaJuridica', formGroup);
  }

  /**
   *
   */
  ngOnDestroy():void
  {
    this.form.removeControl('pessoaJuridica');
  }
}
