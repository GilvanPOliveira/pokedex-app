export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonSummary[];
}

export interface PokemonSummary {
  name: string;
  url: string;
}

export interface PokemonDetails {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other?: Record<string, any>;
  };
  types: Array<{ slot: number; type: { name: string } }>;
  abilities: Array<{ is_hidden: boolean; slot: number; ability: { name: string } }>;
  stats: Array<{ base_stat: number; effort: number; stat: { name: string } }>;
  moves: Array<{ move: { name: string } }>;
  capture_rate: number;
  location_areas: string[];
}

export interface PokemonSpecies {
  capture_rate: number;
}

export interface PokemonEncounter {
  location_area: { name: string; url: string };
}
