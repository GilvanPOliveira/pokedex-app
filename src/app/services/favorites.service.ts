import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PokemonCard {
  id: number;
  name: string;
  imageUrl: string;
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private favoritesMap = new Map<number, PokemonCard>();
  private favoritesSubject = new BehaviorSubject<PokemonCard[]>([]);

  readonly favorites$: Observable<PokemonCard[]> = this.favoritesSubject.asObservable();

  listFavorites(): PokemonCard[] {
    return Array.from(this.favoritesMap.values());
  }

  addFavorite(pokemon: PokemonCard): void {
    if (!this.favoritesMap.has(pokemon.id)) {
      this.favoritesMap.set(pokemon.id, pokemon);
      this.emit();
    }
  }

  removeFavorite(id: number): void {
    if (this.favoritesMap.delete(id)) {
      this.emit();
    }
  }

  isFavorite(id: number): boolean {
    return this.favoritesMap.has(id);
  }

  clearFavorites(): void {
    this.favoritesMap.clear();
    this.emit();
  }

  private emit(): void {
    this.favoritesSubject.next(this.listFavorites());
  }
}
