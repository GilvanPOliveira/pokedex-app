import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomePage } from './pages/home/home.page';
import { DetalhesPage } from './pages/detalhes/detalhes.page';
import { FavoritosPage } from './pages/favoritos/favoritos.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'detalhes/:id',
    component: DetalhesPage
  },
  {
    path: 'favoritos',
    component: FavoritosPage
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
