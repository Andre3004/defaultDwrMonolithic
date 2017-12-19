import { AuthGuard } from './controls/auth/auth-guard.service';
import {NgModule} from '@angular/core';
import {RouterModule, Routes, PreloadAllModules} from '@angular/router';
import {ConsultarCursosAprovadosComponent} from './views/curso/consultar-cursos-aprovados/consultar-cursos-aprovados.component';
import {CursoViewComponent} from './views/curso/curso-view.component';
import {TermosUsoViewComponent} from "./views/curso/termos-uso/termos-uso.component";
import { SobreViewComponent } from './views/sobre/sobre-view.component';


const routes: Routes = [

  { path: '', redirectTo: 'cursos', pathMatch: 'full'},
  { path: 'termos-uso', component: TermosUsoViewComponent},
  { path: 'sobre', component: SobreViewComponent},
  { path: 'conta', loadChildren: '../app/views/conta/conta.module#ContaModule'},
  { path: 'dashboard', loadChildren: '../app/views/dashboard/dashboard.module#DashboardModule'},
  {
    path: 'cursos', component: CursoViewComponent,
    children: [
      { path: '', component: ConsultarCursosAprovadosComponent},
      { path: ':id', loadChildren: '../app/views/curso/curso.module#CursoModule'},
    ]
  },
];

/**
 *
 */
@NgModule({
  imports: [
    RouterModule.forRoot(
    routes,
    {
      useHash: true,
    }
  ),
],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule
{
}
