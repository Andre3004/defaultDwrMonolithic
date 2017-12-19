import { Broker } from "eits-ngx";
import { textMasks } from "./../../../../controls/text-masks/text-masks";
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from "@angular/core";
import { MatSnackBar, MatSelectChange } from "@angular/material";
import { AuthenticatedUserService } from "../../../../controls/authenticated-user/authenticated-user.service";
import { Subscription } from "rxjs/Subscription";
import { FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: 'dados-matricula',
  templateUrl: './dados-matricula.component.html',
  styleUrls: ['./dados-matricula.component.css']
})
export class DadosMatriculaComponent implements OnInit, OnDestroy
{
  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/
  /**
   *
   */
  @Input()
  compra: any;

  /**
   *
   */
  @Input()
  turma: any;

  /**
   *
   */
  @Output()
  onComplete: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  @Output()
  onCompleteCompra: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  @Output()
  onChange: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  masks: any = textMasks;

  /**
   *
   */
  lotes: any[];

  /**
   *
   */
  loteSelected: any;

  /**
   *
   */
  oldLote: any;

  /**
   *
   */
  isResponsavelAluno: string;

  /**
   *
   */
  termosUso;

  /**
   *
   */
  timeOutForSearch: any;

  /**
   *
   */
  findingAluno: boolean;

  /**
   *
   */
  userSubscription: Subscription;

  /**
   * 
   */




  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/

  /**
   *
   */
  constructor(public authenticatedUserService: AuthenticatedUserService)
  {
    this.userSubscription = authenticatedUserService.authenticatedUserChanged.subscribe((user) =>
    {
      for (let i = 0; i < this.turma.lotes.length; i++)
      {
        for (let j = 0; j < this.turma.lotes[i].matriculas.length; j++)
        {
          if (this.turma.lotes[i].matriculas[j].aluno)
          {
            if (this.turma.lotes[i].matriculas[j].aluno.isResponsavel)
            {
              this.turma.lotes[i].matriculas[j].aluno = {};
            }
          }
        }
      }
      if (!this.compra.responsavel.isEmpresa)
      {
        if (this.isResponsavelAluno == "SIM")
        {
          this.markReponsavelAsAluno(this.loteSelected, null);
        }
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
    this.termosUso = { isAccepted: false };

  }

  /**
   * 
   */
  ngOnDestroy()
  {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

  /**
   *
   */
  initDadosMatricula()
  {
    //Reinicia os parametros somente se a quantidade de matrículas tiver mudado
    if (!this.compra.matriculas || this.compra.matriculas.length == 0)
    {
      this.compra.responsavel.isResponsavelAluno = false;
      if (!this.compra.responsavel.tipoDocumentoEstrangeiro)
      {
        this.compra.responsavel.selectTipoDocumento = 'Passaporte';
      }
      else
      {
        this.compra.responsavel.selectTipoDocumento = 'Outro';
      }

      this.compra.matriculas = [];

      this.turma.lotes.forEach((lote: any) =>
      {
        for (let i = 0; i < lote.quantidade; i++)
        {
          let matriculaLength = this.compra.matriculas.push(
            {
              aluno:
              {
                isEmpresa: false,
                isEstrangeiro: false,
                tipoDocumentoEstrangeiro: null,
                documentoEstrangeiro: null,
                selectTipoDocumento: 'Passaporte'
              },
              turma: this.turma,
              compra: this.compra,
              lote: lote
            });
          lote.matriculas.push(this.compra.matriculas[matriculaLength - 1]);
        }
      });
      this.lotes = this.turma.lotes.filter(lote => !!lote.quantidade);
      this.loteSelected = this.lotes[0];

      if (!this.compra.responsavel.isEmpresa && (!this.isResponsavelAluno || this.isResponsavelAluno === 'SIM'))
      {
        this.isResponsavelAluno = 'SIM';
        this.markReponsavelAsAluno(this.loteSelected, 0);
      }
    }
    else
    {
      /**
       * Caso não tenha mudado a quantidade de matriculas por lote
       * e o responsavel é empresa e a opção de responsavel ser aluno ser true
       * então quer dizer que o aluno mudou para empresa, e não deve mais ser marcado como aluno
       * por tanto marca reponsavel as aluno no lote null
       */
      if (this.compra.responsavel.isEmpresa && this.isResponsavelAluno === 'SIM')
      {
        this.markReponsavelAsAluno(null, null);
      }
      else
        if (this.isResponsavelAluno === 'SIM')
        {
          this.markReponsavelAsAluno(this.loteSelected, 0);
        }
    }
  }

  /**
   *
   */
  submit(event: Event)
  {
    event.preventDefault();

    if (this.compra.valor)
    {
      this.onComplete.emit();
    }
    else
    {
      if (this.termosUso.isAccepted)
      {
        this.onCompleteCompra.emit();
      }
      else
      {
        this.termosUso.requiredError = true;
      }
    }
  }

  /**
   *
   */
  formChanged()
  {
    this.onChange.emit();
  }

  /**
   *
   */
  findAlunoByRg(loteIndex: number, matriculaIndex: number)
  {
    /**
     * Espera o timeout para fazer a pesquisa,
     * se caso tiver outra alteração durante a espera
     * limpa o timeout e começa denovo a contar
     */
    clearTimeout(this.timeOutForSearch);

    this.findingAluno = true;

    this.timeOutForSearch = setTimeout((matriculaIndex: number) =>
    {
      let registroGeral = this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno.registroGeral;
      let email = this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno.email;

      if (registroGeral || email)
      {
        if ((registroGeral === this.compra.responsavel.registroGeral || email == this.compra.responsavel.email) && !this.compra.responsavel.isEmpresa)
        {
          this.isResponsavelAluno = "SIM";
          this.loteSelected = this.turma.lotes[loteIndex];
          this.markReponsavelAsAluno(this.turma.lotes[loteIndex], matriculaIndex);
          this.findingAluno = false;
        }
        else
        {
          Broker.of("usuarioService").promise("findUsuarioByRg", email, registroGeral)
            .then((result) =>
            {
              //Se o rg do aluno já existe o aluno recebe o aluno deste rg
              if (result)
              {
                this.verifyExists(email, registroGeral);
                this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno = result;
                this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno.isResponsavel = false;
                this.findingAluno = false;
              }
              else
              {
                //Se o aluno já foi inicializado e o rg não existe mais, os dados do aluno serão apagados e receberá só o rg
                if (this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno.id)
                {
                  let rg = this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno.registroGeral;
                  let email = this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno.email;
                  this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno = { registroGeral: rg, email: email };
                }
                this.findingAluno = false;
              }
            })
            .catch((message) =>
            {
              this.findingAluno = false;
              console.log(message);
            });
        }
      }
      else
      {
        //Se o aluno já foi inicializado e o rg não existe mais, os dados do aluno serão apagados e receberá só o rg
        if (this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno.id)
        {
          let rg = this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno.registroGeral;
          let email = this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno.email;
          this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno = { registroGeral: rg, email: email };
        }
        this.findingAluno = false;
      }
      if (!this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno.tipoDocumentoEstrangeiro && this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno.selectTipoDocumento === 'Passaporte')
      {
        this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno.tipoDocumentoEstrangeiro = 'Passaporte'
      }
      let tipoDocumentoEstrangeiro;
      let documentoEstrangeiro;
      if (this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno.isEstrangeiro)
      {
        tipoDocumentoEstrangeiro = this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno.tipoDocumentoEstrangeiro;
        documentoEstrangeiro = this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno.documentoEstrangeiro;
      }
      if (tipoDocumentoEstrangeiro || documentoEstrangeiro)
      {

        if ((tipoDocumentoEstrangeiro === this.compra.responsavel.tipoDocumentoEstrangeiro && documentoEstrangeiro == this.compra.responsavel.documentoEstrangeiro) && this.compra.responsavel.isEstrangeiro)
        {
          this.isResponsavelAluno = "SIM";
          this.loteSelected = this.turma.lotes[loteIndex];
          this.markReponsavelAsAluno(this.turma.lotes[loteIndex], matriculaIndex);
          this.findingAluno = false;
        }
        else
        {
          Broker.of("usuarioService").promise("findByDocumentoEstrangeiro", tipoDocumentoEstrangeiro, documentoEstrangeiro)
            .then((result) =>
            {
              //Se o rg do aluno já existe o aluno recebe o aluno deste rg
              if (result)
              {
                this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno = result;
                this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno.isResponsavel = false;
                if (!this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno.tipoDocumentoEstrangeiro)
                {
                  this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno.selectTipoDocumento = 'Passaporte';
                }
                else
                {
                  if (this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno.tipoDocumentoEstrangeiro == 'Passaporte')
                  {
                    this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno.selectTipoDocumento = 'Passaporte';
                  }
                  else
                  {
                    this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno.selectTipoDocumento = 'Outro';
                  }
                }
                this.findingAluno = false;
              }
              else
              {
                //Se o aluno já foi inicializado e o rg não existe mais, os dados do aluno serão apagados e receberá só o rg
                if (this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno.id)
                {
                  let tipoDocumentoEstrangeiro = this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno.tipoDocumentoEstrangeiro;
                  let documentoEstrangeiro = this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno.documentoEstrangeiro;
                  this.turma.lotes[loteIndex].matriculas[matriculaIndex].aluno = { tipoDocumentoEstrangeiro: tipoDocumentoEstrangeiro, documentoEstrangeiro: documentoEstrangeiro };
                }
                this.findingAluno = false;
              }
            })
            .catch((message) =>
            {
              this.findingAluno = false;
              console.log(message);
            });
        }

      }

      this.formChanged();
    }, 1000, matriculaIndex);
  }

  /**
   *
   * @param rg
   * @param email
   */
  public verifyExists(email, registroGeral)
  {
    for (let i = 0; i < this.turma.lotes.length; i++)
    {
      for (let j = 0; j < this.turma.lotes[i].matriculas.length; j++)
      {
        if (this.turma.lotes[i].matriculas[j].aluno.email && (this.turma.lotes[i].matriculas[j].aluno.registroGeral || this.turma.lotes[i].matriculas[j].aluno.documentoEstrangeiro))
        {
          if ((this.turma.lotes[i].matriculas[j].aluno.email === email) || (this.turma.lotes[i].matriculas[j].aluno.registroGeral === registroGeral))
          {
            this.turma.lotes[i].matriculas[j].aluno = {selectTipoDocumento: 'Passaporte'};
          }
        }
      }
    }
  }

  /**
   *
   */
  getNumbers(str: string)
  {
    return str.replace(/[^0-9]/g, '');// Sobrescreve tudo o que nao é número com vazio
  }

  /**
   *
   * @param lote
   */
  public markReponsavelAsAluno(lot: any, matriculaIndex: number): void
  {
    if (!lot)
    {
      for (let i = 0; i < this.turma.lotes.length; i++)
      {
        for (let j = 0; j < this.turma.lotes[i].matriculas.length; j++)
        {
          if (this.turma.lotes[i].matriculas[j].aluno)
          {
            if (this.turma.lotes[i].matriculas[j].aluno.isResponsavel)
            {
              this.turma.lotes[i].matriculas[j].aluno = {selectTipoDocumento: 'Passaporte'};
            }
          }
        }
      }
    }

    if (lot)
    {
      const lote = this.lotes.filter(loteInner => loteInner.id == lot.id)[0];
      if (!matriculaIndex)
      {
        this.verifyExists(this.compra.responsavel.email, this.compra.responsavel.registroGeral);
        lote.matriculas[0].aluno = this.compra.responsavel;
        lote.matriculas[0].aluno.isResponsavel = true;

      }
      else
      {
        this.verifyExists(this.compra.responsavel.email, this.compra.responsavel.registroGeral);
        lote.matriculas[matriculaIndex].aluno = this.compra.responsavel;
        lote.matriculas[matriculaIndex].aluno.isResponsavel = true;
      }
    }

    if (this.oldLote && this.oldLote != lot && lot)
    {
      const lote = this.lotes.filter(loteInner => loteInner.id == this.oldLote.id)[0];
      if (!matriculaIndex)
      {
        if (lote.matriculas[0].aluno)
        {
          lote.matriculas[0].aluno = {};
          lote.matriculas[0].aluno.isResponsavel = false;
        }
      }
      else
      {
        if (lote.matriculas[matriculaIndex].aluno)
        {
          lote.matriculas[matriculaIndex].aluno = {};
          lote.matriculas[matriculaIndex].aluno.isResponsavel = false;
        }
      }
    }

    this.oldLote = lot;
  }

  /**
   *
   * @param loteId
   * @returns {number}
   */
  public getFirstMatriculaByLoteId(loteId): number
  {
    return this.compra.matriculas.indexOf(this.compra.matriculas.filter(matricula => matricula.lote.id == loteId)[0]);
  }

  /**
   *
   */
  public isResponsavelAlunoChange(): void
  {
    if (this.isResponsavelAluno === "SIM")
    {
      this.markReponsavelAsAluno(this.loteSelected, null);
    }
    else
    {
      this.markReponsavelAsAluno(null, null);
    }
  }

  /**
   *
   * @param aluno
   */
  public emailChanged(aluno)
  {
    if (aluno.email === "")
    {
      aluno.email = null;
    }

  }

  /**
   * 
   * @param mdSelectChange 
   */

}
