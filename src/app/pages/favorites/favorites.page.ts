import { Component, OnInit } from '@angular/core';
import { IonicModule }        from '@ionic/angular';
import { CommonModule }       from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FavoritesService }   from '../../services/favorites.service';
import { PokemonCard }        from '../home/home.page';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})

export class FavoritesPage implements OnInit {
  favorites: PokemonCard[] = [];
  constructor(
    private favoritesService: FavoritesService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loadFavorites();
  }
  private async loadFavorites(): Promise<void> {
    this.favorites = await this.favoritesService.listFavorites();
  }
  openDetails(id: number): void {
    this.router.navigate(['/details', id]);
  }
  removeFavorite(p: PokemonCard, e: Event): void {
    e.stopPropagation();
    this.favoritesService.toggleFavorite(p);
    this.favorites = this.favorites.filter(f => f.id !== p.id);
  }
}