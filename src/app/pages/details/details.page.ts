import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokeapiService } from '../../services/pokeapi.service';
import { PokemonDetails } from '../../models/pokemon.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss']
})
export class DetailsPage implements OnInit {
  details!: PokemonDetails;
  imageUrl = '';
  artworkUrl = '';

  constructor(
    private route: ActivatedRoute,
    private pokeService: PokeapiService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.pokeService.getPokemonDetails(id).subscribe(details => {
      this.details = details;
      this.imageUrl = details.sprites.front_default;
      this.artworkUrl =
        details.sprites.other?.['official-artwork']?.front_default || '';
    });
  }
}
