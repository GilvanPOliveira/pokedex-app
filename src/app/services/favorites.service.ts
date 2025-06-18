import { Injectable } from '@angular/core';
import { PokemonCard } from '../pages/home/home.page';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favorites: PokemonCard[] = [];

  listFavorites(): Promise<PokemonCard[]> {
    return Promise.resolve([...this.favorites]);
  }

  getAll(): PokemonCard[] {
    return [...this.favorites];
  }

  isFavorite(id: number): boolean {
    return this.favorites.some(p => p.id === id);
  }

  add(card: PokemonCard): void {
    if (!this.isFavorite(card.id)) {
      this.favorites.push(card);
    }
  }

  remove(card: PokemonCard): void {
    const idx = this.favorites.findIndex(p => p.id === card.id);
    if (idx >= 0) {
      this.favorites.splice(idx, 1);
    }
  }

  toggleFavorite(card: PokemonCard): void {
    const idx = this.favorites.findIndex(p => p.id === card.id);
    if (idx >= 0) {
      this.favorites.splice(idx, 1);
    } else {
      this.favorites.push(card);
    }
  }

  clear(): void {
    this.favorites = [];
  }
}
