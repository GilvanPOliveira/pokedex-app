import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

import { PokeapiService } from '../../services/pokeapi.service';
import { FavoritesService } from '../../services/favorites.service';
import { PokemonDetails } from '../../models/pokemon.model';
import { PokemonCard } from '../home/home.page';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  details!: PokemonDetails;
  imageUrl = '';
  artworkUrl = '';

  constructor(
    private route: ActivatedRoute,
    private pokeService: PokeapiService,
    private favService: FavoritesService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.pokeService.getPokemonDetails(id).subscribe((d) => {
      this.details = d;
      this.imageUrl = d.sprites.front_default;
      this.artworkUrl =
        d.sprites.other?.['official-artwork']?.front_default || '';
    });
  }

  isFavorite(): boolean {
    return this.favService.isFavorite(this.details.id);
  }

  toggleFavorite(): void {
    const card: PokemonCard = {
      id: this.details.id,
      name: this.details.name,
      imageUrl: this.artworkUrl || this.imageUrl,
    };
    this.favService.toggleFavorite(card);
  }
}
