import { AfterViewInit, ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild } from "@angular/core";
import { MapsAPILoader } from "@agm/core";
import { Broker } from "eits-ngx";

import { Endereco } from "./endereco.model";
import { textMasks } from "./../text-masks/text-masks";
import { AuthenticatedUserService } from "../authenticated-user/authenticated-user.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {MatAutocompleteSelectedEvent } from "@angular/material";

declare var google: any;

@Component({
  selector: 'maps-component',
  templateUrl: 'maps.component.html',
  styleUrls: ['maps.component.css'],
})
export class MapsComponent implements OnInit, AfterViewInit
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
  @ViewChild('autocomplete')
  inputAutocomplete;

  /**
   *
   */
  @Input()
  isEstrangeiro: boolean;

  /**
   * 
   */
  @Input()
  showMap: boolean = true;

  /**
   *
   */
  @Input()
  endereco: any = {
    cidade: {
      isNotNormalizado: false,
      estado: {
        isNotNormalizado: false,
        nome: null,
        uf: null,
        pais: {
          nome: null,
        },
      }
    }
  };

  /**
   * 
   */
  zoom: number = 13;

  /**
   *
   */
  address = {};

  /**
   *
   */
  extend = {};

  /**
   *
   */
  wasSearched: Boolean = false;

  /**
   *
   */
  masks = textMasks;

  /**
   *
   */
  componentForm: any;

  /**
   *
   */
  authenticatedUser: any;

  /**
   *
   */
  @Input()
  myAddresOption: boolean;

  /**
   *
   */
  viewLoaded: boolean = false;

  /**
   * 
   */
  filteredCidades: any[] = [];

  /**
   * 
   */
  filteredEstados: any[] = [];

  /**
   * 
   */
  userSubscription: any;

  /**
   * 
   */
  filteredPaises: any[] = [];


  /*-------------------------------------------------------------------
  *                           CONSTRUCTOR
  *-------------------------------------------------------------------*/

  constructor(public authenticatedUserService: AuthenticatedUserService, public _loader: MapsAPILoader, public _zone: NgZone, public changeDetectionRef: ChangeDetectorRef, public fb: FormBuilder)
  {
    this.userSubscription = authenticatedUserService.authenticatedUserChanged.subscribe((user) =>
    {
      this.authenticatedUser = user;
    });
  }



  /*-------------------------------------------------------------------
  *                           BEHAVIORS
  *-------------------------------------------------------------------*/

  /**
   *
   */
  ngOnInit(): void
  {

    const formGroup = new FormGroup({
      logradouro: new FormControl('logradouro', Validators.required),
      numero: new FormControl('numero', Validators.required),
      bairro: new FormControl('bairro', Validators.required),
      cep: new FormControl('cep', Validators.required),
      cidade: new FormControl('cidade', [Validators.required]),
      estado: new FormControl('estado', Validators.required),
      uf: new FormControl('uf', Validators.required),
      pais: new FormControl('pais', Validators.required)

    });
    if (!this.form)
    {
      this.form = this.fb.group({});
    }

    this.form.addControl('endereco', formGroup);

    if (!this.endereco.cidade || !this.endereco.cidade.estado)
    {
      this.endereco.cidade = {
        isNotNormalizado: false,
        estado: {
          isNotNormalizado: false,
          nome: null,
          uf: null,
          pais: {
            nome: null,
          },
        }
      };
    }

    this.getExtend();

    this.autocomplete();

    this.getAuthenticatedUser();

  }

  /**
 *
 */
  ngAfterViewInit()
  {
    this.viewLoaded = true;
    this.changeDetectionRef.detectChanges();
  }

  /**
   *
   */
  public getAuthenticatedUser(): void
  {
    this.authenticatedUserService.getPromiseAuthenticatedUser()
      .then((result) =>
      {
        if (result)
        {
          this.authenticatedUser = result;
        }
      })
  }

  /**
   *
   */
  public autocomplete()
  {
    this._loader.load().then(() =>
    {
      let autocomplete = new google.maps.places.Autocomplete(this.inputAutocomplete.nativeElement, {});

      google.maps.event.addListener(autocomplete, 'place_changed', () =>
      {
        this._zone.run(() =>
        {
          this.wasSearched = true;

          let place = autocomplete.getPlace();


          // Limpa o campo de search
          this.inputAutocomplete.nativeElement.value = "";


          if (place.geometry)
          {
            this.zoom = 15;
            this.endereco.latitude = place.geometry.location.lat();
            this.endereco.longitude = place.geometry.location.lng();

            this.getExtend();

            this.address = {};

            this.componentForm = {
              street_number: 'short_name',
              route: 'long_name',
              administrative_area_level_2: 'long_name',
              administrative_area_level_1: this.isEstrangeiro ? 'long_name' : 'short_name',
              postal_code: 'short_name',
              sublocality_level_1: 'short_name',
              country: 'long_name'
            };

            // Get each component of the address from the place details
            // and fill the corresponding field on the form.
            for (let i = 0; i < place.address_components.length; i++)
            {
              let addressType = place.address_components[i].types[0];
              if (this.componentForm[addressType])
              {
                this.address[addressType] = place.address_components[i][this.componentForm[addressType]];
              }
            }

            this.parseEndereco(this.address);
            if (!this.isEstrangeiro)
            {
              this.findCidadeByNomeAndEstadoUf(this.endereco.cidade.nome, this.endereco.cidade.estado.uf);
            }
            else
            {
              this.findEstadoByNomeAndPais(this.endereco.cidade.estado.nome, this.endereco.cidade.estado.pais.nome);
            }
          }
        });
      });
    });
  }

  /**
   *
   */
  public findCidadeByNomeAndEstadoUf(cidade, uf)
  {
    if (cidade && uf && !this.isEstrangeiro)
    {
      Broker.of("enderecoService").promise("findCidadeByNomeAndEstadoUf", cidade, uf)
        .then((result) =>
        {
          if (result)
          {
            this.endereco.cidade = result;
            this.form.get('endereco').get('cidade').setErrors(null);
          }
          else
          {
            this.form.get('endereco').get('cidade').setErrors({ exception: 'Cidade não encontrada' })
          }
        }).catch((exception) =>
        {
          this.form.get('endereco').get('cidade').setErrors({ exception: 'Cidade não encontrada' })
        });
    }
  }

  /**
   *
   */
  public findCidade(cidade, uf)
  {
    this.findCidadeByNomeAndEstadoUf(cidade, uf);
  }

  /**
   *
   * @param address
   */
  public parseEndereco(address) 
  {
    this.endereco.numero = address.street_number ? address.street_number : "";
    this.endereco.logradouro = address.route ? address.route : "";
    this.endereco.cep = address.postal_code ? address.postal_code : "";
    this.endereco.cidade.nome = address.administrative_area_level_2 ? address.administrative_area_level_2 : "";
    if (!this.isEstrangeiro)
    {
      this.endereco.cidade.estado.uf = address.administrative_area_level_1 ? address.administrative_area_level_1 : "";
    }
    else
    {
      this.endereco.cidade.estado.nome = address.administrative_area_level_1 ? address.administrative_area_level_1 : "";
    }
    this.endereco.cidade.estado.pais.nome = address.country ? address.country : "";
    this.endereco.bairro = address.sublocality_level_1 ? address.sublocality_level_1 : "";
  }

  /**
   *
   */
  public getExtend()
  {
    this.extend = {
      latitude: this.endereco.latitude ? this.endereco.latitude : -25.514861,
      longitude: this.endereco.longitude ? this.endereco.longitude : -54.568438
    }
  }

  /**
   *
   * @param event
   */
  public markerDragEnd(event)
  {
    this.endereco.latitude = event.coords.lat;
    this.endereco.longitude = event.coords.lng;
  }

  /**
 *
 */
  public fillWithMyAddress()
  {
    this.endereco.logradouro = this.authenticatedUser.endereco.logradouro;
    this.endereco.numero = this.authenticatedUser.endereco.numero;
    this.endereco.bairro = this.authenticatedUser.endereco.bairro;
    this.endereco.cep = this.authenticatedUser.endereco.cep;
    this.endereco.cidade = this.authenticatedUser.endereco.cidade;
    this.endereco.complemento = this.authenticatedUser.endereco.complemento;
  }

  ngOnDestroy()
  {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

  /**
   * Popula o autcomplete de cidade
   */
  public findCidadesByFilters(filter: String)
  {
    if (!this.isEstrangeiro)
    {
      Broker.of("enderecoService").promise("listCidadesByNome", filter,
        { size: 50, page: 0, sort: { orders: [{ direction: "ASC", property: "nome", nullHandlingHint: "NATIVE" }] } })
        .then(result =>
        {
          this.filteredCidades = result.content;
        });
    }
    else
    {
      this.filteredCidades = null;
    }
  }

  /**
   * Seta o objeto cidade ao selecionar no autocomplete
   */
  public setCidade(cidade: any)
  {
    this.endereco.cidade = cidade;
  }

  /**
   * Populando o autocomplete de estado
   */
  public findEstadosEstrangeirosByFilters(filter: String)
  {

    Broker.of("enderecoService").promise("listEstadosEstrangeirosByNome", filter,
      { size: 50, page: 0, sort: { orders: [{ direction: "ASC", property: "nome", nullHandlingHint: "NATIVE" }] } })
      .then(result =>
      {
        this.filteredEstados = result.content;
      });


  }

  /**
   * Seta o Objeto estado ao selecionar no autocomplete
   */
  public setEstado(estado: any)
  {
    this.endereco.cidade.estado = estado;
  }

  /**
   * Populando o automplete de pais
   */
  public findPaisesByFilters(filter: String)
  {
    Broker.of("enderecoService").promise("findPaisesByFilters", filter,
      { size: 50, page: 0, sort: { orders: [{ direction: "ASC", property: "nome", nullHandlingHint: "NATIVE" }] } })
      .then(result =>
      {
        this.filteredPaises = result.content;
      });
  }

  /**
   * verifica se o estado corresponde ao pais, se nao seta o mesmo como null
   */
  public findEstadoByNomeAndPais(nomeEstado, nomePais)
  {    
    if (nomeEstado && nomePais)
    {
      Broker.of("enderecoService").promise("findEstadoByNomeAndPais", nomeEstado, nomePais)
        .then((result) =>
        {
          if (result)
          {
            this.endereco.cidade.estado = result;
          }
          else
          {
            this.endereco.cidade.estado.id = null;            
          }

        });
    }
  }

  /**
   * 
   * @param pais 
   * seta e valida o pais
   */
  
  public findPaisByNome(pais)
  {
    if (pais)
    {
      Broker.of("enderecoService").promise("findPaisByNome", pais)
        .then((result) =>
        {
          if (result)
          {
            this.endereco.cidade.estado.pais = result;
            this.form.get('endereco').get('pais').setErrors(null);
          }
          else
          {
            this.form.get('endereco').get('pais').setErrors({ exception: 'País não encontrado' })
          }

        });
    }
  }

  /**
   *  Limpa o campo de estado quando o pais for mudado
   */
  public clearEstadoEstrangeiro()
  {

    if (this.endereco.cidade.estado.id)
    {
      this.endereco.cidade.estado.id = null;
      this.endereco.cidade.estado.nome = null;
      this.endereco.cidade.estado.uf = null;
    }
  }


}