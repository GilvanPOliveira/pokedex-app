import { 
  Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef 
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { from, of, Subject } from 'rxjs';
import { 
  mergeMap, toArray, map, catchError, debounceTime, distinctUntilChanged 
} from 'rxjs/operators';

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
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage implements OnInit {
  pokemons: PokemonCard[] = [];
  offset = 0;
  readonly limit = 20;
  totalCount = 0;
  loading = false;

  // Search
  searchTerm = '';
  private searchSubject = new Subject<string>();
  searchMode = false;
  searchResults: PokemonCard[] = [];

  constructor(
    private pokeService: PokeapiService,
    private favService: FavoritesService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // 1) carrega a primeira página
    this.loadPokemons();

    // 2) configura debounce na busca
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => this.performSearch(term));
  }

  /** Chamado do template ao digitar */
  onSearchTermChange(term: string): void {
    this.searchTerm = term;
    this.searchSubject.next(term.trim().toLowerCase());
  }

  /** Lógica de busca após debounce */
  private performSearch(term: string): void {
    if (!term) {
      this.searchMode = false;
      this.searchResults = [];
      this.cd.markForCheck();
      return;
    }
    this.searchMode = true;
    this.searchResults = [];
    this.pokeService.getPokemonDetails(term).subscribe({
      next: d => {
        const anim = (d.sprites as any).versions?.['generation-v']
          ?.['black-white']?.animated?.front_default;
        this.searchResults = [{
          id: d.id,
          name: d.name,
          gifUrl: anim || d.sprites.front_default
        }];
        this.cd.markForCheck();
      },
      error: () => {
        this.searchResults = [];
        this.cd.markForCheck();
      }
    });
  }

  /** Carrega página de pokémons (infinite scroll e pre-fetch) */
  private loadPokemons(event?: any): void {
    if (this.loading) return;
    this.loading = true;

    this.pokeService.getPokemonList(this.offset, this.limit).subscribe({
      next: list => {
        this.totalCount = list.count;

        from(list.results).pipe(
          // 2) mergeMap com concorrência máxima de 5
          mergeMap(summary => {
            const id = this.pokeService.extractId(summary);
            return this.pokeService.getPokemonDetails(id).pipe(
              map(d => {
                const anim = (d.sprites as any).versions?.['generation-v']
                  ?.['black-white']?.animated?.front_default;
                return { id, name: d.name, gifUrl: anim || d.sprites.front_default } as PokemonCard;
              }),
              catchError(() => of({
                id,
                name: summary.name,
                gifUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
              } as PokemonCard))
            );
          }, 5),
          toArray()
        ).subscribe(cards => {
          this.pokemons.push(...cards);
          this.cd.markForCheck();
          this.offset += this.limit;
          this.loading = false;
          event?.target?.complete();
        });
      },
      error: () => {
        this.loading = false;
        event?.target?.complete();
      }
    });
  }

  /** Chamado pelo infinite scroll manual */
  loadMore(event?: any): void {
    this.loadPokemons(event);
  }

  /** Pré-busca quando rolar além de 70% */
  onContentScroll(ev: any): void {
    const detail = ev.detail;
    const scrollTop = detail.scrollTop;
    const maxScroll = detail.scrollHeight - detail.clientHeight;
    const percent = scrollTop / maxScroll;
    if (percent > 0.7 && !this.loading && this.pokemons.length < this.totalCount) {
      this.loadPokemons();
    }
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
    this.cd.markForCheck();
  }
}
