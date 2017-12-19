import { Component, OnInit } from '@angular/core';
import { Broker } from "eits-ngx";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'matriculas-realizadas',
  templateUrl: './matriculas-realizadas.component.html',
  styleUrls: ['./matriculas-realizadas.component.css']
})
export class MatriculasRealizadasComponent implements OnInit
{
   /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/
   /**
   *
   */
  compra: any;

   /*-------------------------------------------------------------------
  *                           CONSTRUCTORS
  *-------------------------------------------------------------------*/
  /**
   *
   */
  constructor(public activatedRoute: ActivatedRoute)
  {
  }
  /*-------------------------------------------------------------------
  *                           BEHAVIORS
  *-------------------------------------------------------------------*/
  /**
   *
   */
  ngOnInit() :void
  {
    Broker.of("compraService").promise("findCompraById", +this.activatedRoute.snapshot.params['id-compra'])
      .then((result) =>
      {
        this.compra = result;
      }).catch((exception) =>
    {
      console.log(exception.message)
    });
  }

}
