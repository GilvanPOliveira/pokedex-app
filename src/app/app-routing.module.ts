import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomePage } from './pages/home/home.page';
import { detailsPage } from './pages/details/details.page';
import { favoritesPage } from './pages/favorites/favorites.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'details/:id',
    component: detailsPage,
  },
  {
    path: 'favorites',
    component: favoritesPage,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
