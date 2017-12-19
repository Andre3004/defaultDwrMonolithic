import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Broker } from "eits-ngx";
import { MatSnackBar } from "@angular/material";
import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'curso-publicado',
  templateUrl: './curso-publicado.component.html',
  styleUrls: ['./curso-publicado.component.css']
})
export class CursoPublicadoComponent implements OnInit
{

  /**
   *
   */
  cursoIsValid: boolean;

  /**
   *
   */
  cursoIsPendente: boolean;

  /**
   *
   */
  curso;

  /**
   *
   */
  isLoading: boolean = true;

  constructor(public activatedRoute: ActivatedRoute, public snackBar: MatSnackBar, public tdDialogService: TdDialogService) { }

  ngOnInit()
  {
    this.findCursoById(this.activatedRoute.parent.snapshot.params['id']);
  }

  findCursoById(cursoId: number)
  {
    Broker.of("cursoService").promise("findCursoById", cursoId)
      .then((result) =>
      {
        if (result)
        {
          this.curso = result;
          this.getCursoIsValidById(this.curso);
        }
      })
      .catch((exception) =>
      {
        console.log(exception.message);
        this.isLoading = false;
      })
  }

  getCursoIsValidById(curso: any)
  {
    if (curso.statusCurso === "PENDENTE")
    {
      this.cursoIsPendente = true;
      this.isLoading = false;
    }
    else if(curso.statusCurso === "RASCUNHO")
    {
      this.cursoIsPendente = false;

      Broker.of("cursoService").promise("getCursoIsValidById", curso.id)
        .then((result) =>
        {
          this.cursoIsValid = result
          this.isLoading = false;
        })
        .catch((exception) =>
        {
          console.log(exception.message);
          this.isLoading = false;
        })
    }
  }

    /**
   *
   */
  public updateCursoWithStatusPendente()
  {
    Broker.of("cursoService").promise("updateCursoWithStatusPendente", this.curso.id)
      .then((result) =>
      {
        if(result){
          this.openSnackBar("Curso enviado para análise");
  
          this.curso = result;
  
          this.getCursoIsValidById(this.curso);
        }
      })
      .catch((exception) =>
      {
        this.openSnackBar(exception.message);
        });
    
  }
  
  /**
   * 
   */
  public validateCursoById()
  {
    Broker.of("cursoService").promise("validateCursoById", this.curso.id)
      .then((result)=>{})
      .catch((exception)=>
      {
        this.openSnackBar(exception.message);
      });
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
