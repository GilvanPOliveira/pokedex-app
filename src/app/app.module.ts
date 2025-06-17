import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicRouteStrategy, IonicModule } from '@ionic/angular';
import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HomePage } from './pages/home/home.page';
import { DetalhesPage } from './pages/detalhes/detalhes.page';
import { FavoritosPage } from './pages/favoritos/favoritos.page';

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    DetalhesPage,
    FavoritosPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    provideHttpClient(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
