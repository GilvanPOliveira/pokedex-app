// src/app/pages/details/details.page.ts

import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

import { PokeapiService } from '../../services/pokeapi.service';
import { PokemonDetails } from '../../models/pokemon.model';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  details!: PokemonDetails;

  constructor(
    private route: ActivatedRoute,
    private pokeService: PokeapiService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.pokeService.getPokemonDetails(id).subscribe((details) => {
      this.details = details;
    });
  }
}
