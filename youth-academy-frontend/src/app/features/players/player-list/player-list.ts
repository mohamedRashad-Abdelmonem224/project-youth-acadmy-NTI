import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PlayerService } from '../../../core/services/player.service';
import { AuthService } from '../../../core/services/auth.service';
import { Player, PlayerPosition } from '../../../core/models/player.model';
import { PlayerCard } from '../player-card/player-card';
import { PlayerSubmit } from '../player-submit/player-submit';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, PlayerCard, PlayerSubmit],
  templateUrl: './player-list.html',
  styleUrl: './player-list.scss',
})
export class PlayerList implements OnInit {
  players = signal<Player[]>([]);
  loading = signal(true);
  errorMsg = signal('');

  view = signal<'top10' | 'all'>('top10');
  positionFilter = signal<PlayerPosition | 'all'>('all');

  sectionTitle = computed(() => {
    if (this.positionFilter() !== 'all') return `${this.positionFilter()} PLAYERS`;
    return this.view() === 'top10' ? 'TOP 10#' : 'ALL PLAYERS';
  });

  visiblePlayers = computed(() => {
    const all = this.players();

    if (this.positionFilter() !== 'all') {
      return all.filter((p) => p.position === this.positionFilter());
    }

    if (this.view() === 'all') return all;

    // TOP 10: أعلى 10 لاعبين حسب آخر تقييم
    return [...all]
      .sort(
        (a, b) => (b.rating[b.rating.length - 1] ?? 0) - (a.rating[a.rating.length - 1] ?? 0),
      )
      .slice(0, 10);
  });

  constructor(
    private playerService: PlayerService,
    public auth: AuthService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const view = params.get('view');
      const position = params.get('position');
      this.view.set(view === 'all' ? 'all' : 'top10');
      this.positionFilter.set((position as PlayerPosition) || 'all');
    });

    this.fetchPlayers();
  }

  fetchPlayers() {
    this.loading.set(true);
    this.playerService.getPlayers().subscribe({
      next: (res) => {
        this.players.set(res.data.players);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Unable to load player data, please make sure the server is running.');
        this.loading.set(false);
      },
    });
  }
}
