// src/app/services/pokeapi.service.spec.ts

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { PokeapiService } from './pokeapi.service';
import {
  PokemonListResponse,
  PokemonDetailsWithSprites,
} from '../models/pokemon.model';

describe('PokeapiService', () => {
  let service: PokeapiService;
  let httpMock: HttpTestingController;
  const API = 'https://pokeapi.co/api/v2/pokemon';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokeapiService],
    });
    service = TestBed.inject(PokeapiService);
    httpMock = TestBed.inject(HttpTestingController);
    service.clearCache();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch and cache a page of Pokémon list', () => {
    const fakeResponse: PokemonListResponse = {
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'bulbasaur', url: '...' }],
    };

    // Primeira chamada: dispara HTTP
    service.getPokemonList(0, 1).subscribe((res) => {
      expect(res).toEqual(fakeResponse);
    });
    const req1 = httpMock.expectOne(
      (req) =>
        req.method === 'GET' &&
        req.url === API &&
        req.params.get('offset') === '0' &&
        req.params.get('limit') === '1'
    );
    req1.flush(fakeResponse);

    // Segunda chamada com mesmo offset/limit: sem novo HTTP
    service.getPokemonList(0, 1).subscribe((res) => {
      expect(res).toEqual(fakeResponse);
    });
    httpMock.expectNone(API);
  });

  it('should evict least-recently-used page when cache limit exceeded', () => {
    for (let i = 0; i < 11; i++) {
      service.getPokemonList(i, 1).subscribe();
      const req = httpMock.expectOne(
        (req) => req.params.get('offset') === `${i}`
      );
      req.flush({ count: 0, next: null, previous: null, results: [] });
    }
    // Agora o offset 0 foi evicto → dispara novo fetch
    service.getPokemonList(0, 1).subscribe();
    const reqAgain = httpMock.expectOne(
      (req) => req.params.get('offset') === '0'
    );
    reqAgain.flush({ count: 0, next: null, previous: null, results: [] });
  });

  it('should fetch and cache Pokémon detail', () => {
    service.getPokemonDetails(1).subscribe((res) => {
      expect(res.id).toBe(1);
    });

    // Intercepta as três chamadas: basic, species e encounters
    const basicReq = httpMock.expectOne(`${API}/1`);
    basicReq.flush({
      id: 1,
      name: 'bulbasaur',
      sprites: {
        front_default: '',
        back_default: '',
        front_shiny: '',
        back_shiny: '',
      },
      types: [],
      abilities: [],
      stats: [],
      moves: [],
    });

    const speciesReq = httpMock.expectOne(
      `${API.replace(/\/pokemon$/, '/pokemon-species')}/1`
    );
    speciesReq.flush({ capture_rate: 45 } as any);

    const encReq = httpMock.expectOne(`${API}/1/encounters`);
    encReq.flush([{ location_area: { name: 'kanto-route-1' } }] as any);

    // Segunda chamada: sem novas requisições
    service.getPokemonDetails(1).subscribe();
    httpMock.expectNone(`${API}/1`);
    httpMock.expectNone(`${API.replace(/\/pokemon$/, '/pokemon-species')}/1`);
    httpMock.expectNone(`${API}/1/encounters`);
  });
});
