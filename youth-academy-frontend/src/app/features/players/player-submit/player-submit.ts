import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { PlayerService } from '../../../core/services/player.service';

@Component({
  selector: 'app-player-submit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-submit.html',
  styleUrl: './player-submit.scss',
})
export class PlayerSubmit {
  @Output() submitted = new EventEmitter<void>();

  name = '';
  team = '';
  // تم تغيير القيم الابتدائية إلى 0 بدلاً من null لضمان استقرار الإرسال
  goals = 0;
  assists = 0;
  matches = 0;
  position = '';
  video = '';
  imageFile: File | null = null;

  loading = signal(false);
  message = signal('');
  isError = signal(false);

  constructor(private playerService: PlayerService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.imageFile = input.files?.[0] ?? null;
  }

  submit() {
    if (!this.name || !this.position) {
      this.isError.set(true);
      this.message.set('Please enter your name and select at least position.');
      return;
    }

    this.loading.set(true);
    this.isError.set(false);
    this.message.set('');

    // تم تمرير قيم الأرقام مباشرة دون الحاجة لشروط التحقق من الـ null
    this.playerService
      .createPlayer({
        name: this.name,
        team: this.team,
        position: this.position,
        video: this.video,
        goals: this.goals,
        assists: this.assists,
        matches: this.matches,
        imageFile: this.imageFile,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.isError.set(false);
          this.message.set('Submitted successfully! Your numbers are awaiting admin approval');
          this.resetForm();
          this.submitted.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);
          this.isError.set(true);
          this.message.set(err.error?.message || 'error occurred while sending');
        },
      });
  }

  private resetForm() {
    this.name = '';
    this.team = '';
    // إعادة تعيين الحقول لقيم صفرية عند تنظيف الفورم
    this.goals = 0;
    this.assists = 0;
    this.matches = 0;
    this.position = '';
    this.video = '';
    this.imageFile = null;
  }
}
