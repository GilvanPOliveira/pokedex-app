import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { PokeapiService } from '../../services/pokeapi.service';
import { FavoritesService } from '../../services/favorites.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

export interface PokemonCard {
  id: number;
  name: string;
  imageUrl: string;
  gifUrl?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pokemons: PokemonCard[] = [];
  offset = 0;
  readonly limit = 20;
  loading = false;

  constructor(
    private pokeService: PokeapiService,
    private favService: FavoritesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPokemons();
  }

  loadPokemons(event?: any): void {
    if (this.loading) return;
    this.loading = true;

    this.pokeService.getPokemonList(this.offset, this.limit).subscribe({
      next: (list) => {
        const newCards = list.results.map((summary) => {
          const id = this.pokeService.extractId(summary);
          const card = {
            id,
            name: summary.name,
            imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
          } as PokemonCard;
          this.pokemons.push(card);
          return card;
        });
        // agora buscamos os detalhes só para os GIFs:
        forkJoin(
          newCards.map((c) =>
            this.pokeService.getPokemonDetails(c.id).pipe(
              map((d) => {
                const sprites = d.sprites as any;
                return {
                  id: c.id,
                  gif:
                    sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default || '',
                };
              })
            )
          )
        ).subscribe((arr) =>
          arr.forEach(({ id, gif }) => {
            const card = this.pokemons.find((p) => p.id === id);
            if (card) card.gifUrl = gif;
          })
        );
        this.offset += this.limit;
      },
      complete: () => {
        this.loading = false;
        event?.target?.complete();
      },
    });
  }

  loadMore(event: any): void {
    this.loadPokemons(event);
  }

  openDetails(id: number): void {
    this.router.navigate(['/details', id]);
  }

  isFavorite(id: number): boolean {
    return this.favService.isFavorite(id);
  }

  toggleFavorite(p: PokemonCard, e: Event): void {
    e.stopPropagation();
    this.favService.toggleFavorite(p);
  }
}
