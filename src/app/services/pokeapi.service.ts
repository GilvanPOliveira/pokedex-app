import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { shareReplay, retry, catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  PokemonListResponse,
  PokemonSummary,
  PokemonDetails,
  PokemonSpecies,
  PokemonEncounter,
  Sprite,
  PokemonDetailsWithSprites
} from '../models/pokemon.model';

@Injectable({ providedIn: 'root' })
export class PokeapiService {
  private readonly baseUrl   = environment.pokeApiUrl;
  private readonly speciesUrl = this.baseUrl.replace(/\/pokemon$/, '/pokemon-species');
  private listCache    = new Map<string, Observable<PokemonListResponse>>();
  private detailsCache = new Map<string, Observable<PokemonDetailsWithSprites>>();
  constructor(private http: HttpClient) {}
  getPokemonList(offset = 0, limit = 20): Observable<PokemonListResponse> {
    const key = `${offset}-${limit}`;
    if (!this.listCache.has(key)) {
      const params = new HttpParams()
        .set('offset', offset.toString())
        .set('limit', limit.toString());
      const req$ = this.http.get<PokemonListResponse>(this.baseUrl, { params }).pipe(
        retry(1),
        shareReplay(1),
        catchError(err => this.handleError(err))
      );
      this.listCache.set(key, req$);
    }
    return this.listCache.get(key)!;
  }
  getPokemonDetails(idOrName: number | string): Observable<PokemonDetailsWithSprites> {
    const key = idOrName.toString().toLowerCase();
    if (!this.detailsCache.has(key)) {
      const basic$      = this.http.get<Omit<PokemonDetails, 'capture_rate'|'location_areas'>>(`${this.baseUrl}/${key}`);
      const species$    = this.http.get<PokemonSpecies>(`${this.speciesUrl}/${key}`);
      const encounters$ = this.http.get<PokemonEncounter[]>(`${this.baseUrl}/${key}/encounters`);
      const combined$ = forkJoin({ basic: basic$, species: species$, encounters: encounters$ }).pipe(
        retry(1),
        map(({ basic, species, encounters }) => {
          const details: PokemonDetailsWithSprites = {
            ...basic,
            capture_rate: species.capture_rate,
            location_areas: encounters.map(e => e.location_area.name),
            spriteList: this.buildSpriteList(basic.sprites)
          };
          return details;
        }),
        shareReplay(1),
        catchError(err => this.handleError(err))
      );
      this.detailsCache.set(key, combined$);
    }
    return this.detailsCache.get(key)!;
  }
  private buildSpriteList(s: PokemonDetails['sprites']): Sprite[] {
    const list: Sprite[] = [
      { label: 'Frente',        url: s.front_default },
      { label: 'Costas',        url: s.back_default! },
      { label: 'Frente Shiny',  url: s.front_shiny! },
      { label: 'Costas Shiny',  url: s.back_shiny! }
    ];
    return list.filter(item => !!item.url);
  }
  extractId(summary: PokemonSummary): number {
    const trimmed = summary.url.replace(/\/+$/, '');
    const parts = trimmed.split('/');
    return Number(parts[parts.length - 1]);
  }
  clearCache(): void {
    this.listCache.clear();
    this.detailsCache.clear();
  }
  private handleError(err: any): Observable<never> {
    return throwError(() => new Error('Erro ao comunicar com a PokeAPI'));
  }
}