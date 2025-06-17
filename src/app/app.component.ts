import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <ion-header>
        <ion-toolbar>
          <ion-title>PokeDex</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content>
        <ion-router-outlet></ion-router-outlet>
      </ion-content>

      <ion-footer>
        <ion-toolbar>
          <ion-segment
            [value]="selectedSegment"
            (ionChange)="onSegmentChange($event)"
          >
            <ion-segment-button value="list">
              <ion-label>Lista</ion-label>
            </ion-segment-button>
            <ion-segment-button value="favorites">
              <ion-label>Favoritos</ion-label>
            </ion-segment-button>
          </ion-segment>
        </ion-toolbar>
      </ion-footer>
    </ion-app>
  `,
  styles: [
    `
      ion-footer {
        --border-width: 1px 0 0;
      }
      ion-segment-button {
        flex: 1;
      }
    `,
  ],
})
export class AppComponent {
  selectedSegment: 'list' | 'favorites' = 'list';

  constructor(private router: Router) {
    // Sincroniza segment com a rota atual
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        const path = e.urlAfterRedirects.split('/')[1];
        this.selectedSegment = path === 'favorites' ? 'favorites' : 'list';
      });
  }

  onSegmentChange(event: CustomEvent) {
    const segment = event.detail.value as 'list' | 'favorites';
    this.router.navigate(segment === 'list' ? ['/'] : ['/favorites']);
  }
}
