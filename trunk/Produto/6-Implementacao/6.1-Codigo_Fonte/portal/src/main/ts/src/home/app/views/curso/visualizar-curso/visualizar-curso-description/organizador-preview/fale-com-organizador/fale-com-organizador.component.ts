import { Component, ElementRef, Inject, Renderer, ViewChild } from "@angular/core";
import { Broker } from 'eits-ngx';
import { AuthenticatedUserService } from "../../../../../../controls/authenticated-user/authenticated-user.service";
import { SugerirAreaConhecimentoComponent } from "../../../../../area-conhecimento/sugerir-area-conhecimento/sugerir-area-conhecimento.component";
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from "@angular/material";
import { FormBuilder, Validators } from "@angular/forms";
import { RecaptchaComponent } from "ng-recaptcha";

@Component({
  selector: 'fale-com-organizador',
  templateUrl: './fale-com-organizador.component.html',
  styleUrls: ['./fale-com-organizador.component.css']
})
export class FaleComOrganizadorComponent
{
  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  @ViewChild(RecaptchaComponent)
  reCaptcha: RecaptchaComponent;

  /**
   *
   */
  form: any;

  /**
   *
   * @type {{nome: string; descricao: string}}
   */
  public sendEmail: any = {
    nome: null,
    email: null,
    mensagem: null,
    isUserAuthenticated: false,
    siteKey: null,
    recap: null,
    cursoId: null
  };

  /*-------------------------------------------------------------------
   *                           CONSTRUCTORS
   *-------------------------------------------------------------------*/
  /**
   *
   */
  constructor(public snackBar: MatSnackBar, public dialogRef: MatDialogRef<SugerirAreaConhecimentoComponent>, public authenticatedUserService: AuthenticatedUserService,
    public fb: FormBuilder, @Inject(ElementRef) public element: ElementRef, public renderer: Renderer, @Inject(MAT_DIALOG_DATA) public data: any)
  {
    this.sendEmail.cursoId = data.cursoId;
    Broker.of("usuarioService").promise("getSiteKey")
      .then((result) =>
      {
        this.sendEmail.siteKey = result;
      });
  }

  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/
  /**
   *
   * @param {string} captchaResponse
   */
  resolved(captchaResponse: string)
  {
    this.sendEmail.recap = captchaResponse;
  }

  /**
   *
   */
  reset()
  {
    if (!this.sendEmail.isUserAuthenticated)
    {
      this.reCaptcha.reset();
    }
  }

  /**
   *
   */
  ngOnInit()
  {
    this.form = this.fb.group({
      nome: ['nome', [Validators.required]],
      email: ['email', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      mensagem: ['mensagem', [Validators.required]]
    });

    this.getAuthenticatedUser();
  }

  /**
   *
   * @param alunoId
   */
  public getAuthenticatedUser()
  {
    this.authenticatedUserService.getPromiseAuthenticatedUser().then(
      (authenticatedUser) =>
      {
        this.sendEmail.isUserAuthenticated = !!authenticatedUser;
      }
    )
  }

  /**
   *
   */
  public submit()
  {
    this.sendMessage(this.sendEmail);
  }

  /**
   *
   */
  public sendMessage(sendEmail: any)
  {
    Broker.of("usuarioService").promise("sendEmailFaleComOrganizador", sendEmail.nome, sendEmail.email, sendEmail.mensagem, sendEmail.cursoId, sendEmail.recap)
      .then((result) =>
      {
        this.reset();
        this.openSnackBar('Mensagem enviada com sucesso');
        this.dialogRef.close();
      })
      .catch((exception) =>
      {
        this.reset();
        this.openSnackBar(exception.message);
      });
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
}
