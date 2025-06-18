import { TestBed } from '@angular/core/testing';
import { FavoritesService } from './favorites.service';
import { PokemonCard } from '../pages/home/home.page';

describe('FavoritesService', () => {
  let service: FavoritesService;

  const card1: PokemonCard = {
    id: 1,
    name: 'bulbasaur',
    gifUrl: 'https://example.com/bulbasaur.gif',
  };
  const card2: PokemonCard = {
    id: 2,
    name: 'ivysaur',
    gifUrl: 'https://example.com/ivysaur.gif',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FavoritesService],
    });
    service = TestBed.inject(FavoritesService);
    service.clear(); 
  });

  it('should start with no favorites', () => {
    expect(service.getAll()).toEqual([]);
  });

  it('should add and remove favorites correctly', () => {
    service.add(card1);
    expect(service.isFavorite(1)).toBeTrue();
    expect(service.getAll()).toEqual([card1]);

    service.add(card2);
    expect(service.getAll()).toContain(card2);
    expect(service.getAll().length).toBe(2);

    service.remove(card1);
    expect(service.isFavorite(1)).toBeFalse();
    expect(service.getAll()).toEqual([card2]);
  });

  it('should not duplicate favorites', () => {
    service.add(card1);
    service.add(card1);
    expect(service.getAll()).toEqual([card1]);
  });
});
