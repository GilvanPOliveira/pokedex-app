import { HomePage }      from './pages/home/home.page';
import { DetailsPage }   from './pages/details/details.page';
import { FavoritesPage } from './pages/favorites/favorites.page';

export const routes = [
  { path: '',            component: HomePage },
  { path: 'details/:id', component: DetailsPage },
  { path: 'favorites',   component: FavoritesPage },
];
