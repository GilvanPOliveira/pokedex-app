import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { PokemonDetailsWithSprites } from '../../models/pokemon.model';
import { PokeapiService } from '../../services/pokeapi.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})

export class DetailsPage implements OnInit {
  details!: PokemonDetailsWithSprites;
  isFav = false;
  captureRatePercent = 0;
  constructor(
    private route: ActivatedRoute,
    private pokeService: PokeapiService,
    private favService: FavoritesService,
    private alertCtrl: AlertController
  ) {}
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isFav = this.favService.isFavorite(id);
    this.pokeService.getPokemonDetails(id).subscribe((d) => {
      this.details = d;
      this.captureRatePercent = Math.round((d.capture_rate / 255) * 100);
    });
  }
  toggleFavorite(): void {
    const spriteUrl = this.details.spriteList[0]?.url || '';
    const card = {
      id: this.details.id,
      name: this.details.name,
      imageUrl: spriteUrl,
      gifUrl: spriteUrl,
    };
    this.favService.toggleFavorite(card);
    this.isFav = !this.isFav;
  }
  async showExtras(
    type: 'abilities' | 'moves' | 'location_areas'
  ): Promise<void> {
    let items: string[] = [];
    let header: string;
    if (type === 'abilities') {
      header = 'Habilidades';
      items = this.details.abilities.map((a) => a.ability.name);
    } else if (type === 'moves') {
      header = 'Movimentos';
      items = this.details.moves.map((m) => m.move.name);
    } else {
      header = 'Locais de Encontro';
      items = this.details.location_areas;
    }
    const formatted = items.map((slug) =>
      slug
        .split('-')
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(' ')
    );
    const message = `${formatted.map((label) => ` ${label}`)}
  `;
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['Fechar'],
    });
    await alert.present();
  }
}