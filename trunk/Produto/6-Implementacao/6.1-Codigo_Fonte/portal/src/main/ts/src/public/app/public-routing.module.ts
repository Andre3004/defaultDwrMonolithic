import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CodigoIncorporacaoView } from "./views/codigo-incorporacao/codigo-incorporacao-view.component";
import { PublicComponent } from "./public.component";

const routes: Routes = [
    {
        path: ':id-turma', component: CodigoIncorporacaoView, pathMatch: 'full'
    }
];

/**
 * 
 */
@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
    providers: []
})
export class PublicRoutingModule 
{
}
