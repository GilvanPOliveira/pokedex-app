import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';

interface PokemonCard {
  id: number;
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss']
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
}
