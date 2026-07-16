import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Chart, registerables } from 'chart.js';
import { PlayerService } from '../../../core/services/player.service';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { Player } from '../../../core/models/player.model';
import { getEmbedUrl } from '../../../shared/utils/video.util';
import {
  analyzeLastThreeSeasons,
  classifyPlayer,
  SEASON_LABELS,
  SeasonDevelopment,
} from '../../../shared/utils/player-insights.util';

Chart.register(...registerables);

@Component({
  selector: 'app-player-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-profile.html',
  styleUrl: './player-profile.scss',
})
export class PlayerProfile implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('ratingChart') ratingChartRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('devChart') devChartRef?: ElementRef<HTMLCanvasElement>;

  player = signal<Player | null>(null);
  loading = signal(true);
  errorMsg = signal('');
  development = signal<SeasonDevelopment | null>(null);

  private ratingChart?: Chart;
  private devChart?: Chart;
  private playerId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playerService: PlayerService,
    private adminService: AdminService,
    private sanitizer: DomSanitizer,
    public auth: AuthService,
  ) {}

  ngOnInit() {
    this.playerId = this.route.snapshot.paramMap.get('id') ?? '';
    this.playerService.getPlayerById(this.playerId).subscribe({
      next: (res) => {
        this.player.set(res.data.player);
        this.development.set(analyzeLastThreeSeasons(res.data.player));
        this.loading.set(false);
        // الشارت بيتبني بعد ما الـ canvas يبقى موجود فعليًا في الـ DOM
        setTimeout(() => this.renderCharts(), 0);
      },
      error: () => {
        this.errorMsg.set(' player not exist or there was a loading error');
        this.loading.set(false);
      },
    });
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.ratingChart?.destroy();
    this.devChart?.destroy();
  }

  get imgUrl(): string {
    return this.playerService.resolveImage(this.player()?.img);
  }

  get videoUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(getEmbedUrl(this.player()?.video));
  }

  get tier() {
    const p = this.player();
    return p ? classifyPlayer(p) : null;
  }

  private renderCharts() {
    const p = this.player();
    if (!p) return;

    if (this.ratingChartRef) {
      this.ratingChart?.destroy();
      this.ratingChart = new Chart(this.ratingChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: SEASON_LABELS.slice(-p.rating.length),
          datasets: [
            {
              label: 'التقييم',
              data: p.rating,
              borderColor: '#ff0000',
              backgroundColor: 'rgba(255,0,0,0.15)',
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          plugins: { legend: { labels: { color: '#fff' } } },
          scales: {
            x: { ticks: { color: '#ccc' }, grid: { color: '#333' } },
            y: { ticks: { color: '#ccc' }, grid: { color: '#333' } },
          },
        },
      });
    }

    const dev = this.development();
    if (this.devChartRef && dev) {
      const color =
        dev.trend === 'up' ? '#1e8a34' : dev.trend === 'down' ? '#d40000' : '#d4af00';

      this.devChart?.destroy();
      this.devChart = new Chart(this.devChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: dev.labels,
          datasets: [
            {
              label: ' evaluate the last 3 season  ',
              data: dev.values,
              backgroundColor: color,
              borderRadius: 6,
            },
          ],
        },
        options: {
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: '#ccc' }, grid: { display: false } },
            y: { ticks: { color: '#ccc' }, grid: { color: '#333' } },
          },
        },
      });
    }
  }

  back() {
    this.router.navigate(['/']);
  }

  deletePlayer() {
    if (!confirm('Are you sure you want to permanently delete this player?')) return;
    this.playerService.deletePlayer(this.playerId).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => alert('An error occurred during deletion.'),
    });
  }

  approve() {
    this.adminService.approvePlayer(this.playerId).subscribe({
      next: (res) => this.player.set(res.player),
    });
  }
}
