import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { from, of } from 'rxjs';
import { mergeMap, toArray, map, catchError } from 'rxjs/operators';
import { PokeapiService } from '../../services/pokeapi.service';
import { FavoritesService } from '../../services/favorites.service';

export interface PokemonCard {
  id: number;
  name: string;
  gifUrl: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {
  pokemons: PokemonCard[] = [];
  offset = 0;
  readonly limit = 20;
  totalCount = 0;
  loading = false;
  searchTerm = '';
  searchMode = false;
  searchResults: PokemonCard[] = [];
  constructor(
    private pokeService: PokeapiService,
    private favService: FavoritesService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loadPokemons();
  }
  private loadPokemons(event?: any): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.pokeService.getPokemonList(this.offset, this.limit).subscribe({
      next: (list) => {
        this.totalCount = list.count;
        from(list.results)
          .pipe(
            mergeMap(
              (summary) => {
                const id = this.pokeService.extractId(summary);
                return this.pokeService.getPokemonDetails(id).pipe(
                  map((d) => {
                    const anim = (d.sprites as any).versions?.[
                      'generation-v'
                    ]?.['black-white']?.animated?.front_default;
                    return {
                      id,
                      name: d.name,
                      gifUrl: anim || d.sprites.front_default,
                    } as PokemonCard;
                  }),
                  catchError(() =>
                    of({
                      id,
                      name: summary.name,
                      gifUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
                    } as PokemonCard)
                  )
                );
              },
              5 
            ),
            toArray()
          )
          .subscribe((cards) => {
            this.pokemons.push(...cards);
            this.offset += this.limit;
            this.loading = false;
            event?.target?.complete();
          });
      },
      error: () => {
        this.loading = false;
        event?.target?.complete();
      },
    });
  }
  loadMore(event?: any): void {
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
  onSearchTermChange(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.searchMode = false;
      this.searchResults = [];
      return;
    }
    this.searchMode = true;
    this.searchResults = [];
    this.pokeService.getPokemonDetails(term).subscribe({
      next: (d) => {
        const anim = (d.sprites as any).versions?.['generation-v']?.[
          'black-white'
        ]?.animated?.front_default;
        this.searchResults = [
          {
            id: d.id,
            name: d.name,
            gifUrl: anim || d.sprites.front_default,
          },
        ];
      },
      error: () => {
        this.searchResults = [];
      },
    });
  }
}