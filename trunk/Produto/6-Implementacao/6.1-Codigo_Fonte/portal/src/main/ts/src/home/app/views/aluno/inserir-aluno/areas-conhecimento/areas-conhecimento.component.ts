import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Broker } from "eits-ngx";
import 'rxjs/add/observable/fromPromise';
import { Observable } from 'rxjs/Observable';
import { SugerirAreaConhecimentoComponent } from '../../../area-conhecimento/sugerir-area-conhecimento/sugerir-area-conhecimento.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'areas-conhecimento',
  templateUrl: './areas-conhecimento.component.html',
  styleUrls: ['./areas-conhecimento.component.css']
})
export class AreasConhecimentoComponent implements OnInit, OnDestroy
{
  /*-------------------------------------------------------------------
  *                           ATTRIBUTES
  *-------------------------------------------------------------------*/
  /**
   *
   */
  @Input()
  public usuario :any = {
    areasInteresse : [],
    areasAtuacao : []
  };
  
  /**
   *
   */
  @Input()
  public disabled : boolean = false;
  
  /**
   *
   */
  public areasInteresse : any[];
  
  /**
   *
   */
  public areasAtuacao : any[];
  
  /**
   *
   */
  public areaInteresseSelected: any = [];
  
  /**
   *
   */
  public areaAtuacaoSelected: any = [];
  
  /**
   *  Armazena as áreas de interesse removidas, para que não dê problema de chave composta duplicada no momento de reinseri-las
   */
  areasInteresseToDelete : any = [];
  
  /**
   * 
   */
  private areaConhecimentoSubscription: Subscription;
  
  /**
   * 
   */
  private areaInteresseSubscription: Subscription;
  
  /*-------------------------------------------------------------------
  *                           CONSTRUCTORS
  *-------------------------------------------------------------------*/
  /**
   *
   */
  constructor(public snackBar: MatSnackBar, public dialog: MatDialog)
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
    this.initArrays();
    for (let areaAtuacao of this.usuario.areasAtuacao)
    {
      this.areasAtuacao.push(areaAtuacao.areaConhecimento);
    }
    for (let areaInteresse of this.usuario.areasInteresse)
    {
      this.areasInteresse.push(areaInteresse.areaConhecimento);
    }
  }

  /**
   * 
   */
  ngOnDestroy(): void
  {
    if(this.areaInteresseSubscription) this.areaInteresseSubscription.unsubscribe();
    if(this.areaConhecimentoSubscription) this.areaConhecimentoSubscription.unsubscribe();
  }
  
  /**
   *
   */
  public initArrays()
  {
    this.areasAtuacao = [];
    this.areaAtuacaoSelected = [];
    if (!this.usuario.areasAtuacao)
    {
      this.usuario.areasAtuacao = [];
    }
    this.areasInteresse = [];
    this.areaInteresseSelected = [];
    this.areasInteresseToDelete = [];
    if (!this.usuario.areasInteresse)
    {
      this.usuario.areasInteresse = [];
    }
  }
  
  /**
   *
   * @param areaConhecimento
   */
  public removeAreaAtuacao(areaConhecimento)
  {
    for (var i = 0; i < this.usuario.areasAtuacao.length; i++)
    {
      if (areaConhecimento.id == this.usuario.areasAtuacao[i].areaConhecimento.id)
      {
        this.usuario.areasAtuacao.splice(i, 1);
      }
    }
  }
  
  /**
   *
   * @param areaConhecimento
   */
  public insertAreaAtuacao(areaConhecimento)
  {
    this.usuario.areasAtuacao.push({ 'areaConhecimento' : areaConhecimento, 'instrutor' : this.usuario });
  }
  
  /**
   *
   * @param areaConhecimento
   */
  public removeAreaInteresse(areaConhecimento)
  {
    for (var i = 0; i < this.usuario.areasInteresse.length; i++)
    {
      if (areaConhecimento.id == this.usuario.areasInteresse[i].areaConhecimento.id)
      {
        this.areasInteresseToDelete.push(this.usuario.areasInteresse[i]);
        this.usuario.areasInteresse.splice(i, 1);
      }
    }
  }

  /**
   *
   * @param areaConhecimento
   */
  public insertAreaInteresse(areaConhecimento)
  {
    for (let areaInteresseToDelete of this.areasInteresseToDelete)
    {
      if (areaInteresseToDelete.areaConhecimento.id == areaConhecimento.id)
      {
        this.usuario.areasInteresse.push({ 'id': areaInteresseToDelete.id, 'areaConhecimento' : areaConhecimento, 'aluno' : this.usuario });
        return;
      }
    }
    this.usuario.areasInteresse.push({ 'areaConhecimento' : areaConhecimento, 'aluno' : this.usuario });
  }

  /**
   *
   * @param filter
   */
  public listAreasInteresseByFilters(filter: String)
  {
    let areaConhecimentoIds  = this.extractIdsFromAreasConhecimento(this.areasInteresse);

    this.areaInteresseSubscription = this.listAreasConhecimentoByFilters(filter, areaConhecimentoIds).subscribe(result =>
    {
      this.areaInteresseSelected = result.content;
    });
  }

  /**
   *
   * @param filter
   */
  public listAreasAtuacaoByFilters(filter: String)
  {
    let areaConhecimentoIds  = this.extractIdsFromAreasConhecimento(this.areasAtuacao);

    this.areaConhecimentoSubscription = this.listAreasConhecimentoByFilters(filter, areaConhecimentoIds).subscribe(result =>
    {
      this.areaAtuacaoSelected = result.content;
    });
  }

  /**
   *
   * @param areasConhecimento
   */
  public extractIdsFromAreasConhecimento(areasConhecimento): any{
    let areaConhecimentoIds = null;
    for (let areaConhecimento of areasConhecimento)
    {
      if(!areaConhecimentoIds)
        areaConhecimentoIds = [];
      areaConhecimentoIds.push(areaConhecimento.id);
    }
    return areaConhecimentoIds;
  }

  /**
   *
   * @param filter
   * @param areaInteresseIds
   * @param pageable
   * @returns {any}
   */
  public listAreasConhecimentoByFilters(filter, areaInteresseIds): any
  {
    const subscription = Observable.fromPromise(Broker.of("areaConhecimentoService").promise("listAreasConhecimentoByFilterss", filter, areaInteresseIds, { size: 50, page: 0, sort: { orders: [{ direction: "ASC", property: "nome", nullHandlingHint: "NATIVE" }]}})
      .then(result =>
      {
        return result;
      }));
    return subscription;
  }

  /**
   *
   */
  public insertAreaConhecimentoAndSendMailSugerirAreaConhecimento():void
  {
    let dialogRef = this.dialog.open( SugerirAreaConhecimentoComponent);

    dialogRef.afterClosed().subscribe(sugestaoAreaConhecimento => {
      if(sugestaoAreaConhecimento) {
        Broker.of("cursoService").promise("insertAreaConhecimentoAndSendMailSugerirAreaConhecimento", sugestaoAreaConhecimento.nome, sugestaoAreaConhecimento.descricao)
          .then(() => {
            this.snackBar.open('Sugestão enviada com sucesso', 'Fechar',  {
              duration: 3000
            });
          });
      }
    });
  }
}
