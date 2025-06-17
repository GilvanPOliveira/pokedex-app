import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { FavoritesService } from '../../services/favorites.service';

interface PokemonCard {
  id: number;
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  favorites: PokemonCard[] = [];

  constructor(private favService: FavoritesService, private router: Router) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  private async loadFavorites(): Promise<void> {
    this.favorites = await this.favService.listFavorites();
  }

  openDetails(id: number): void {
    this.router.navigate(['/details', id]);
  }
}
