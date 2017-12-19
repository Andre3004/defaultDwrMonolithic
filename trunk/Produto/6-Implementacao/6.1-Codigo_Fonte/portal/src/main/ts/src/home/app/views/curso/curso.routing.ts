import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {VisualizarCursoComponent} from "../curso/visualizar-curso/visualizar-curso.component";
import {MatriculasRealizadasComponent} from "../compra/realizar-matriculas/matriculas-realizadas/matriculas-realizadas.component";
import {RealizarMatriculasComponent} from "../compra/realizar-matriculas/realizar-matriculas.component";

const routes: Routes = [
    { path: '', component: VisualizarCursoComponent },
    { path: 'realizar-matriculas/:id-turma', component: RealizarMatriculasComponent },
    { path: 'realizar-matriculas/:id-turma/compra/:id-compra', component: MatriculasRealizadasComponent }
];

export const cursoRouting: ModuleWithProviders = RouterModule.forChild(routes);
