import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, Renderer, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import 'rxjs/add/operator/toPromise';
import { textMasks } from '../../../../controls/text-masks/text-masks';
import { FormBuilder, Validators } from "@angular/forms";
import { dataNascimentoValidator } from "../../../../controls/validators/Validators";
import * as moment from 'moment';
import { ToastyService } from "ng2-toasty";
import { Location } from '@angular/common';
import { AuthenticatedUserService } from '../../../../controls/authenticated-user/authenticated-user.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css'],
})
export class UsuarioFormComponent implements OnInit, OnDestroy
{

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  form: any;

  /**
   *
   */
  masks = textMasks;

  /**
   *
   */
  public messageErroDefault: string = 'Nome de usuário ou senha não conferem';

  /**
   * 
   */

  @Output()
  save: EventEmitter<any> = new EventEmitter();

  /**
   *
   * @type {{fileTransfer: any; foto: any; id: any; nome: any; email: any; password: any; confirmacaoPassword: any; documento: any; isEmpresa: boolean; isInstrutor: any; endereco: {cidade: {nome: any}}}}
   */
  @Input()
  usuario: any = {
    fileTransfer: null,
    foto: null,
    id: null,
    nome: null,
    email: null,
    password: null,
    confirmacaoPassword: null,
    documento: null,
    documentoEstrangeiro: null,
    tipoDocumentoEstrangeiro: null,
    isEmpresa: false,
    isEstrangeiro: false,
    isInstrutor: null,
    endereco: {},
    contatoTelefonico: null,

  };

  public termosUso: any = {
    isAccepted: false
  };

  /**
   * 
   */
  public messageMoIP: string = null;

  /**
   * 
   */
  public userSubscription: Subscription;

  /**
   * 
   */
  public foundUser: Boolean = false;



  /*-------------------------------------------------------------------
   *                           VALIDATORS
   *-------------------------------------------------------------------*/

  /*-------------------------------------------------------------------
   *                           CONSTRUCTORS
   *-------------------------------------------------------------------*/
  /**
   *
   */
  constructor(public snackBar: MatSnackBar, public fb: FormBuilder,
    @Inject(ElementRef) public element: ElementRef, public renderer:
      Renderer, public toastyService: ToastyService,
    private location: Location, public authenticatedUserService: AuthenticatedUserService
  )
  {
    this.userSubscription = authenticatedUserService.authenticatedUserChanged.subscribe((user) =>
    {
      if (user)
      {
        this.foundUser = true;
      }
    });

  }

  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/
  /**
   *
   */
  ngOnInit()
  {
    this.authenticatedUserService.getPromiseAuthenticatedUser()
    .then((result) => {
      if (result) {
        this.foundUser = true;  
      }
    })
    this.form = this.fb.group({
      nome: ['nome', [Validators.required]],
      email: ['email', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      codigoArea: ['codigoArea', [Validators.required, Validators.min(1), Validators.max(99)]],
      codigoInternacional: ['codigoInternacional', [Validators.required, Validators.min(1), Validators.max(99999)]],
      contatoTelefonico: ['contatoTelefonico', [Validators.required, Validators.min(11111111), Validators.max(999999999)]],
      dataNascimento: ['dataNascimento', [Validators.required, dataNascimentoValidator()]],
      selectTipoDocumento: ['selectTipoDocumento', [Validators.required]],
    });
  
    if (this.usuario && this.usuario.dataNascimento)
    {
      this.usuario.dataNascimento = moment(this.usuario.dataNascimento, "DD/MM/YYYY").format("DD/MM/YYYY");
    }

  }
  /**
   *
   */
  public saveUsuario(form: any): void
  {
    if (this.usuario.isInstrutor)
    {
      if (this.usuario.accountId)
      {
        this.messageMoIP = 'Estamos atualizando a conta MoIP';
      }
      else
      {
        this.messageMoIP = 'Estamos criando uma conta MoIP'
      }
    }
    // TODO provisório
    let valid = true;
    let controls: any = [];
    Object.keys(form.controls).map(function (key)
    {
      if (form.controls[key].invalid)
      {
        let control = form.controls[key];
        control.key = '#' + key;
        if (control.controls)
        {
          Object.keys(control.controls).map(function (key)
          {
            if (control.controls[key].invalid)
            {
              let controlInner = control.controls[key];
              controlInner.key = '#' + key;
              controls.push(controlInner);
            }
          });
        }
        else
        {
          controls.push(control);
        }
      }
    });

    for (let control of controls)
    {
      if (control)
      {
        const element = this.element.nativeElement.querySelector(control.key);
        if (element && control.invalid)
        {
          this.renderer.invokeElementMethod(element, 'focus', []);
          valid = false;
          if (control.errors.exception)
            this.error(control.errors.exception);
          break;
        }
        if (control.controls && control.invalid)
        {
          for (let controlInner of control.controls)
          {
            const element = this.element.nativeElement.querySelector(controlInner.key);
            if (element && controlInner.invalid)
            {
              this.renderer.invokeElementMethod(element, 'focus', []);
              valid = false;
              if (controlInner.errors.exception)
                this.error(controlInner.errors.exception);
              break;
            }
          }
        }
      }
    }

    if (valid)
    {
      this.usuario.dataNascimento = moment(this.usuario.dataNascimento, "DD/MM/YYYY").format("DD/MM/YYYY");

      if (this.messageMoIP)
      {
        this.toastyService.wait(this.messageMoIP);
      }

      this.save.emit(this.usuario);
    }

  }

  /**
   *
   * @param event
   */
  public fileChange(event: any, singleFileUpload: any)
  {
    let mega = Math.pow(10, 6);
    let maxSize = 5 * mega;


      this.usuario.fileTransfer = event.target;

      let reader = new FileReader();

      reader.onload = (event: any) =>
      {
        this.usuario.foto = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    

  }

  /**
   *
   */
  public removeFoto()
  {
    this.usuario.foto = null;

    this.usuario.fileTransfer = null;
  }

  /**
   *
   * @param message
   */
  public error(message: string)
  {
    this.openSnackBar(message);
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string)
  {
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }

  /**
   * 
   */
  public backRoute()
  {
    this.location.back();
  }

  /**
   * 
   */

  public clearEnderecoFields()
  {
    this.usuario.endereco =
      {
        cidade: {
          nome: null,
          estado: {
            nome: null,
            uf: null,
            pais: {
              nome: null
            }
          }
        }
      }
  }

  /**
   * 
   */
  public getAuthenticatedUser(): void {
    this.authenticatedUserService.getPromiseAuthenticatedUser()
      .then((result) => {
        if (result) {
          this.foundUser = true;
        }
      })
  }

  /**
   * 
   */
  ngOnDestroy(): void
  {
    this.userSubscription.unsubscribe();
  }
}
