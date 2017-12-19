import { AuthenticatedUserService } from '../../../../../../controls/authenticated-user/authenticated-user.service';
import { MatSnackBar } from '@angular/material';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { textMasks } from '../../../../../../controls/text-masks/text-masks';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Broker } from "eits-ngx";
import { TdCollapseAnimation } from '@covalent/core/common/animations/collapse/collapse.animation';

const CARGA_HORARIA_REGEX = /^([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$/;


@Component({
  selector: 'dados-curso',
  templateUrl: './dados-curso.component.html',
  styleUrls: ['./dados-curso.component.css'],
  animations: [TdCollapseAnimation()]
})
export class DadosCursoComponent implements OnInit
{

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  @Input()
  public curso: any;

  /**
   *
   */
  masks = textMasks;

  /**
   *
   */
  @Output()
  cancel: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  @Output()
  onComplete: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  @Output()
  onChange: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  @Output()
  updateCursoWithStatusPendente: EventEmitter<any> = new EventEmitter();

  /**
   * 
   */
  disponibilizarCertificado: boolean;

  /**
   * 
   */
  fornecedorCertificado = {
    TFC: "TFC",
    ORGANIZADOR: "ORGANIZADOR"
  };

  /**
   *
   */
  editorOptions: Object = {
    extraPlugins: "divarea",
    removePlugins: "flash,forms,iframe,pastefromword,save,print,div,copyformating,specialchars",
    removeButtons: "Anchor,SpecialChar",
    contentsCss: ['styles.css'],
    toolbarGroups: [
      { name: 'document' },
      { name: 'undo' },
      { name: 'basicstyles' },
      { name: 'cleanup' },
      { name: 'list' },
      { name: 'align' },
      { name: 'indent' },
      { name: 'blocks' },
      { name: 'links' },
      { name: 'insert' },
      { name: 'tools' },
      { name: 'colors' },
      { name: 'mode' },
      { name: 'styles' },
    ]
  };


  /**
   *
   */
  isShowRemoveButton: boolean = false;

  /**
   *
   */
  public areaConhecimentoSelected: any = [];

  /**
   *
   */
  public areaConhecimentoList: any[];

  /**
  *
  */
  public pageable = {//PageRequest
    size: 50,
    page: 0,
    sort: null
  };

  /*-------------------------------------------------------------------
   *                           VALIDATORS
   *-------------------------------------------------------------------*/
  /**
   *
   * @type {FormControl}
   */
  formControl = new FormControl('formControl', Validators.required);

  /**
   *
   * @type {FormControl}
   */
  cargaHoraria = new FormControl('', [Validators.required, Validators.pattern(CARGA_HORARIA_REGEX)]);


  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/

  /**
   *
   */
  constructor(public activatedRoute: ActivatedRoute, public router: Router, public snackBar: MatSnackBar, public authenticatedUserService: AuthenticatedUserService)
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
    if (this.curso.cursoAreasConhecimento && this.curso.cursoAreasConhecimento.length > 0)
    {
      this.areaConhecimentoSelected.push(this.curso.cursoAreasConhecimento[0].areaConhecimento);
    }

    this.listAreaConhecimentoByFilters(null);

    if (this.curso.fornecedorCertificado)
    {
      this.disponibilizarCertificado = true;
    }
  }


  /**
   *
   * @param curso
   * @param form
   */
  public submit(curso, form, event: Event)
  {
    event.preventDefault();

    if (form.valid && this.validaForm())
    {
      this.onComplete.emit(curso);
    }
  }

  /**
   *
   * @returns {boolean}
   */
  public validaForm()
  {
    if (!this.curso.descricao || !this.curso.descricao.length)
    {
      this.curso.descricao = "";
      return false;
    }
    if (!this.curso.conteudo || !this.curso.conteudo.length)
    {
      this.curso.conteudo = "";
      return false;
    }
    if (!this.curso.cursoAreasConhecimento || !this.curso.cursoAreasConhecimento.length)
    {
      this.openSnackBar("O curso deve ter ao menos uma área de conhecimento!");
      return false;
    }


    return true;
  }

  /**
   *
   * @param curso
   * @param form
   */
  sendToApprove(curso, form)
  {
    if (form.valid)
    {
      this.updateCursoWithStatusPendente.emit(curso);
    }
  }

  /**
   *
   */
  public removeImagem()
  {
    this.curso.imagem = null;
    this.curso.fileTransfer = null;
    this.isShowRemoveButton = false;
  }

  /**
   *
   * @param event
   */
  public fileChange(event: any, singleFileUpload: any)
  {
    let mega = Math.pow(10, 6);
    let maxSize = 5 * mega;

    this.curso.fileTransfer = event.target;

    let reader = new FileReader();

    reader.onload = (event: any) =>
    {
      this.curso.imagem = event.target.result;
    };

    reader.readAsDataURL(event.target.files[0]);


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
   * @param isShowRemoveButton
   */
  public showRemoveButton(isShowRemoveButton: boolean)
  {
    this.isShowRemoveButton = isShowRemoveButton;
  }

  /**
   *
   */
  public onChangeEmit()
  {
    this.onChange.emit();
  }

  /**
   *
   * @param areaConhecimento
   */
  public addAreaConhecimento(areaConhecimento)
  {
    this.curso.cursoAreasConhecimento = [];
    this.curso.cursoAreasConhecimento.push({
      areaConhecimento: areaConhecimento,
      curso: this.curso
    });
  }

  /**
   *
   */
  public removeAreaConhecimento()
  {
    this.curso.cursoAreasConhecimento = [];
  }

  /**
   *
   */
  public listAreaConhecimentoByFilters(filter: String)
  {
    if (this.areaConhecimentoSelected.length < 1)
    {
      Broker.of("areaConhecimentoService").promise("listChildAreaConhecimentoByFilters", filter, this.pageable)
        .then((result) =>
        {
          this.areaConhecimentoList = result.content;
        })
        .catch((exception) =>
        {
          console.log(exception);
        })
    }
    else
    {
      this.areaConhecimentoList = [];
    }
  }

  /**
   * 
   */
  public toggleFornecedorCertificado()
  {
    if (this.disponibilizarCertificado)
    {
      this.curso.fornecedorCertificado = this.fornecedorCertificado.ORGANIZADOR;
    }
    else
    {
      this.curso.fornecedorCertificado = null;
    }
  }

  /**
   * 
   */
  public verifyCursoHasLotePago()
  {
    if (this.curso.id)
    {
      Broker.of("cursoService").promise("isCursoContainsLoteNaoGratuito", this.curso.id)
        .then((result) =>
        {
          if (result == true && this.curso.isGratuito) 
          {
            this.openSnackBar("Este curso contém lotes pagos");
            this.curso.isGratuito = false;
          }
        })
        .catch((exception) =>
        {
          console.log(exception);
        })
    }
  }
}
