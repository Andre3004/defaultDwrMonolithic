import { AuthGuard } from './../../controls/auth/auth-guard.service';
import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DashboardViewComponent} from "./dashboard-view.component";
import {AlunoViewComponent} from "../aluno/aluno-view.component";
import {ConsultarAlunosComponent} from "../aluno/consultar-alunos/consultar-alunos.component";
import {InserirAlunoComponent} from "../aluno/inserir-aluno/inserir-aluno.component";
import {AlterarAlunoComponent} from "../aluno/alterar-aluno/alterar-aluno.component";
import {VisualizarAlunoComponent} from "../aluno/visualizar-aluno/visualizar-aluno.component";
import {InstrutorViewComponent} from "../instrutor/instrutor-view.component";
import {ConsultarInstrutoresComponent} from "../instrutor/consultar-instrutores/consultar-instrutores.component";
import {InserirInstrutorComponent} from "../instrutor/inserir-instrutor/inserir-instrutor.component";
import {AlterarInstrutorComponent} from "../instrutor/alterar-instrutor/alterar-instrutor.component";
import {VisualizarInstrutorComponent} from "../instrutor/visualizar-instrutor/visualizar-instrutor.component";
import {MinhaContaViewComponent} from "./minha-conta/minha-conta-view.component";
import {VisualizarMinhaContaComponent} from "./minha-conta/visualizar-minha-conta/visualizar-minha-conta.component";
import {AlterarMinhaContaComponent} from "./minha-conta/alterar-minha-conta/alterar-minha-conta.component";
import {CursosViewComponent} from "./cursos/cursos-view.component";
import {CursoInseridoComponent} from "./meus-cursos/inserir-curso/curso-inserido/curso-inserido.component";
import {InserirCursoComponent} from "./meus-cursos/inserir-curso/inserir-curso.component";
import {ConsultarMeusCursosComponent} from "./meus-cursos/consultar-meus-cursos/consultar-meus-cursos.component";
import {ConsultarTurmasComponent} from "./meus-cursos/alterar-curso/alterar-curso-dados-turma/consultar-turmas/consultar-turmas.component";
import {TurmaViewComponent} from "./meus-cursos/alterar-curso/alterar-curso-dados-turma/turma-view.component";
import {AlterarCursoComponent} from "./meus-cursos/alterar-curso/alterar-curso.component";
import {AlterarCursoComponentView} from "./meus-cursos/alterar-curso/alterar-curso-view.component";
import {AlterarTurmaComponent} from "./meus-cursos/alterar-curso/alterar-curso-dados-turma/alterar-turma/alterar-turma.component";
import {InserirTurmaComponent} from "./meus-cursos/alterar-curso/alterar-curso-dados-turma/inserir-turma/inserir-turma.component";
import {CursoPublicadoComponent} from "./meus-cursos/curso-publicado/curso-publicado.component";
import {VisualizarCursoComponent} from "../curso/visualizar-curso/visualizar-curso.component";
import {MatriculasRealizadasComponent} from "../compra/realizar-matriculas/matriculas-realizadas/matriculas-realizadas.component";
import {RealizarMatriculasComponent} from "../compra/realizar-matriculas/realizar-matriculas.component";
import {ConsultarCursosComponent} from "./cursos/consultar-cursos/consultar-cursos.component";
import {CompraViewComponent} from "../compra/compra-view.component";
import {ConsultarMinhasComprasComponent} from "../compra/consultar-minhas-compras/consultar-minhas-compras.component";
import {ConsultarComprasComponent} from "../compra/consultar-compras/consultar-compras.component";
import { VisualizarCompraComponent } from '../compra/visualizar-compra/visualizar-compra.component';

const routes: Routes = [
  {

    path: '', component: DashboardViewComponent, canActivateChild: [AuthGuard],
    children: [
      {
        path: '', redirectTo: 'minha-conta', pathMatch: 'full'
      },
      {
        path: 'alunos', component: AlunoViewComponent,
        children: [
          { path: '', component: ConsultarAlunosComponent },
          { path: 'inserir', component: InserirAlunoComponent },
          { path: ':id/alterar', component: AlterarAlunoComponent },
          { path: ':id', component: VisualizarAlunoComponent },
        ]
      },
      {
        path: 'instrutores', component: InstrutorViewComponent,
        children: [
          { path: '', component: ConsultarInstrutoresComponent },
          { path: 'inserir', component: InserirInstrutorComponent },
          { path: ':id/alterar', component: AlterarInstrutorComponent },
          { path: ':id', component: VisualizarInstrutorComponent },
        ]
      },
      {
        path: 'minha-conta', component: MinhaContaViewComponent,
        children: [
          { path: '', component: VisualizarMinhaContaComponent },
          { path: 'alterar', component: AlterarMinhaContaComponent },
        ]
      },//Está fora da hierarquia de cursos/ para o canActivateChild saber se deve redirecionar para o equivalente fora do dashBoard
      { path: 'cursos/:id', component: VisualizarCursoComponent, data: { redirectToPublic: true }, pathMatch: 'full' }, 
      {
        path: 'cursos',  component: CursosViewComponent,
        children: [
          { path: '', component: ConsultarCursosComponent },
          { path: ':id/realizar-matriculas/:id-turma', component: RealizarMatriculasComponent },
          { path: ':id/realizar-matriculas/:id-turma/compra/:id-compra', component: MatriculasRealizadasComponent }
        ]
      }, //Está fora da hierarquia de cursos/ para o canActivateChild saber se deve redirecionar para o equivalente fora do dashBoard
      { path: 'meus-cursos/inserir', component: InserirCursoComponent },
      { path: 'meus-cursos/:id', component: VisualizarCursoComponent, data: { redirectToPublic: true } },
      {
        path: 'meus-cursos', component: CursosViewComponent,
        children: [
          { path: '', component: ConsultarMeusCursosComponent },
          { path: ':id/realizar-matriculas/:id-turma', component: RealizarMatriculasComponent },
          { path: ':id/realizar-matriculas/:id-turma/compra/:id-compra', component: MatriculasRealizadasComponent },
          { path: ':id/curso-inserido', component: CursoInseridoComponent },
          {
            path: ':id/alterar', component: AlterarCursoComponentView,
            children: [
              { path: 'dados-curso', component: AlterarCursoComponent }, // PASSO 1
              {
                path: 'turmas', component: TurmaViewComponent, //PASSO 2
                children: [
                  { path: '', component: ConsultarTurmasComponent },
                  { path: 'inserir', component: InserirTurmaComponent },
                  {
                    path: 'alterar/:id-turma', component: AlterarTurmaComponent,
                  },
                ]
              },
              { path: 'curso-publicado', component: CursoPublicadoComponent }, //PASSO 3
            ]
          },
        ]
      },
      {
        path: 'minhas-compras', component: CompraViewComponent,
        children: [
          { path: '', component: ConsultarMinhasComprasComponent },
          { path: ':id', component: VisualizarCompraComponent },
        ]
      },
      {
        path: 'compras', component: CompraViewComponent,
        children: [
          { path: '', component: ConsultarComprasComponent },
          { path: ':id', component: VisualizarCompraComponent },
        ]
      }
    ]
  },
];

export const dashboardRouting: ModuleWithProviders = RouterModule.forChild(routes);
