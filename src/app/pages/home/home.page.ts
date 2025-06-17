// src/app/pages/home/home.page.ts

import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { PokeapiService } from '../../services/pokeapi.service';

interface PokemonCard {
  id: number;
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pokemons: PokemonCard[] = [];
  offset = 0;
  readonly limit = 20;
  loading = false;

  constructor(private pokeService: PokeapiService, private router: Router) {}

  ngOnInit(): void {
    this.loadPokemons();
  }

  loadPokemons(event?: any): void {
    if (this.loading) {
      return;
    }
    this.loading = true;

    this.pokeService.getPokemonList(this.offset, this.limit).subscribe({
      next: (list) => {
        list.results.forEach((summary) => {
          const id = this.pokeService.extractId(summary);
          this.pokemons.push({
            id,
            name: summary.name,
            imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
          });
        });
        this.offset += this.limit;
      },
      error: (err) => {
        console.error('Erro ao carregar Pokémons:', err);
        this.loading = false;
        event?.target?.complete();
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
}
