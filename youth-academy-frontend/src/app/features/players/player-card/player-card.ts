import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Player } from '../../../core/models/player.model';
import { PlayerService } from '../../../core/services/player.service';
import { classifyPlayer } from '../../../shared/utils/player-insights.util';

@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './player-card.html',
  styleUrl: './player-card.scss',
})
export class PlayerCard {
  @Input({ required: true }) player!: Player;

  constructor(private playerService: PlayerService) {}

  get imgUrl(): string {
    return this.playerService.resolveImage(this.player.img);
  }

  get tier() {
    return classifyPlayer(this.player);
  }

  get latestRating(): number {
    return this.player.rating[this.player.rating.length - 1] ?? 0;
  }
}
