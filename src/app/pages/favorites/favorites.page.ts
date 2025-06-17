import { Component, OnInit } from '@angular/core';
import { IonicModule }        from '@ionic/angular';
import { CommonModule }       from '@angular/common';
import { RouterModule }       from '@angular/router';
import { FavoritesService, PokemonCard } from '../../services/favorites.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss']
})
export class FavoritesPage implements OnInit {
  favorites: PokemonCard[] = [];

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit(): void {
    this.favoritesService.favorites$.subscribe(list => this.favorites = list);
    this.favorites = this.favoritesService.listFavorites();
  }

  openDetails(id: number): void {
    window.location.href = `/details/${id}`;
  }
}
