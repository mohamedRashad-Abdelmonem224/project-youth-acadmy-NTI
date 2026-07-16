import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { PlayerService } from '../../../core/services/player.service';
import { Player } from '../../../core/models/player.model';

@Component({
  selector: 'app-admin-pending',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-pending.html',
  styleUrl: './admin-pending.scss',
})
export class AdminPending implements OnInit {
  requests = signal<Player[]>([]);
  loading = signal(true);
  errorMsg = signal('');
  busyId = signal<string | null>(null);

  constructor(
    private adminService: AdminService,
    private playerService: PlayerService,
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.adminService.getPendingPlayers().subscribe({
      next: (res) => {
        this.requests.set(res.players);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('pending requests could not be loaded.');
        this.loading.set(false);
      },
    });
  }

  imgUrl(player: Player): string {
    return this.playerService.resolveImage(player.img);
  }

  approve(id: string) {
    this.busyId.set(id);
    this.adminService.approvePlayer(id).subscribe({
      next: () => {
        this.requests.update((list) => list.filter((p) => p._id !== id));
        this.busyId.set(null);
      },
      error: () => {
        this.busyId.set(null);
        alert('error during approvad');
      },
    });
  }

  reject(id: string) {
    this.busyId.set(id);
    this.adminService.rejectPlayer(id).subscribe({
      next: () => {
        this.requests.update((list) => list.filter((p) => p._id !== id));
        this.busyId.set(null);
      },
      error: () => {
        this.busyId.set(null);
        alert('error during rejected');
      },
    });
  }
}
