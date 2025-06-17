import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule, NavigationEnd, provideRouter, Routes } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonicModule, RouterModule],
  template: `
    <ion-app>
      <ion-header>
        <ion-toolbar><ion-title>PokeDex</ion-title></ion-toolbar>
      </ion-header>
      <ion-content><ion-router-outlet /></ion-content>
      <ion-footer>
        <ion-toolbar>
          <ion-segment [value]="selected" (ionChange)="onSegmentChange($event)">
            <ion-segment-button value="list"><ion-label>Lista</ion-label></ion-segment-button>
            <ion-segment-button value="favorites"><ion-label>Favoritos</ion-label></ion-segment-button>
          </ion-segment>
        </ion-toolbar>
      </ion-footer>
    </ion-app>
  `
})
export class AppComponent {
  selected: 'list' | 'favorites' = 'list';
  constructor() {
    provideRouter([]); 
  }
  onSegmentChange(e: any) {
    const v = e.detail.value as 'list' | 'favorites';
    window.history.pushState({}, '', v === 'list' ? '/' : '/favorites');
    this.selected = v;
  }
}
