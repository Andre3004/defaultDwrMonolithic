import { Component, OnInit, Input, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material';
import { DadosMatriculaComponent } from '../../../../compra/realizar-matriculas/dados-matricula/dados-matricula.component';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'documento-estrangeiro',
  templateUrl: './documento-estrangeiro.component.html',
  styleUrls: ['./documento-estrangeiro.component.css']
})
export class DocumentoEstrangeiroComponent implements OnInit, OnDestroy
{




  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
  * 
  */
  @Input()
  usuario: any;

  /**
   * 
   */

  isDisabled: Boolean;

  /**
   * 
   */
  isDisabledSubscription: Subscription;

  /**
   * 
   */
  selectTipoDocumento: any;

  /**
   * 
   */
  @Input()
  form: any;

  /**
   * 
   */


  /*-------------------------------------------------------------------
 *                           CONSTRUCTOR
 *-------------------------------------------------------------------*/

  /**
  * 
  */
  constructor(public fb: FormBuilder) 
  {

  }


  /*-------------------------------------------------------------------
 *                           BEHAVIORS
 *-------------------------------------------------------------------*/
  ngOnInit() 
  {
    if (!this.usuario.tipoDocumentoEstrangeiro)
    {
      this.usuario.tipoDocumentoEstrangeiro = 'Passaporte';
      this.selectTipoDocumento = 'Passaporte';
    }
    else
    {
      if (this.usuario.tipoDocumentoEstrangeiro === 'Passaporte')
      {
        this.selectTipoDocumento = 'Passaporte';
      }
      else
      {
        this.selectTipoDocumento = 'Outro'
      }
    }

    const formGroup = new FormGroup({
      documentoEstrangeiro: new FormControl('documentoEstrangeiro', Validators.required),
      tipoDocumentoEstrangeiro: new FormControl('tipoDocumentoEstrangeiro', Validators.required)
    });

    if (!this.form)
    {
      this.form = this.fb.group({});
    }

    this.form.addControl('documento', formGroup);

  }

  changeTipoDocumento(mdSelectChange: MatSelectChange)
  {
    if (mdSelectChange.value === 'Passaporte')
    {
      this.usuario.tipoDocumentoEstrangeiro = 'Passaporte';
    }
    else
    {
      this.usuario.tipoDocumentoEstrangeiro = null;
    }
  }

  ngOnDestroy(): void
  {
    if (!this.usuario.isEstrangeiro)
    {
      this.usuario.tipoDocumentoEstrangeiro = null;
      this.usuario.documentoEstrangeiro = null;
    }
  }

}
