import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CriarContaInstrutorComponent} from "../instrutor/criar-conta-instrutor/criar-conta-instrutor.component";
import {CriarContaAlunoComponent} from "../aluno/criar-conta-aluno/criar-conta-aluno.component";
import {RecuperarAcessoViewComponent} from "./recuperar-acesso/recuperar-acesso-view.component";
import {RecuperarSenhaComponent} from "./recuperar-acesso/recuperar-senha/recuperar-senha.component";
import {RedefinirSenhaComponent} from "./recuperar-acesso/redefinir-senha/redefinir-senha.component";
import {CompletarCadastroInstrutorComponent} from "./completar-cadastro-instrutor/completar-cadastro-instrutor.component";
import {CompletarCadastroAlunoComponent} from "./completar-cadastro-aluno/completar-cadastro-aluno.component";

const routes: Routes = [
  {  
    path: 'recuperar-acesso', component: RecuperarAcessoViewComponent,
    children: [
      { path: '', component: RecuperarSenhaComponent},
      { path: ':token', component: RedefinirSenhaComponent }
    ]
  },
  {path: 'criar-conta/instrutor', component: CriarContaInstrutorComponent},
  {path: 'criar-conta/aluno', component: CriarContaAlunoComponent},
  {path: 'completar-cadastro/instrutor/:id', component: CompletarCadastroInstrutorComponent},
  {path: 'completar-cadastro/aluno/:id', component: CompletarCadastroAlunoComponent},
];

export const contaRouting: ModuleWithProviders = RouterModule.forChild(routes);
