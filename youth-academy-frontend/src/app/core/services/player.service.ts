import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Player, PlayerResponse, PlayersResponse } from '../models/player.model';

export interface NewPlayerForm {
  name: string;
  team?: string;
  position: string;
  video?: string;
  goals?: number;
  assists?: number;
  matches?: number;
  imageFile?: File | null;
}

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private readonly baseUrl = `${environment.apiUrl}/players`;

  constructor(private http: HttpClient) {}

  getPlayers(): Observable<PlayersResponse> {
    return this.http.get<PlayersResponse>(this.baseUrl);
  }

  getPlayerById(id: string): Observable<PlayerResponse> {
    return this.http.get<PlayerResponse>(`${this.baseUrl}/${id}`);
  }

  createPlayer(form: NewPlayerForm): Observable<PlayerResponse> {
    const fd = new FormData();
    fd.append('name', form.name);
    if (form.team) fd.append('team', form.team);
    fd.append('position', form.position);
    if (form.video) fd.append('video', form.video);
    if (form.goals != null) fd.append('goals', String(form.goals));
    if (form.assists != null) fd.append('assists', String(form.assists));
    if (form.matches != null) fd.append('matches', String(form.matches));
    
    // 🛠️ تم تعديل اسم الحقل هنا من 'imageUrl' إلى 'img' ليتوافق مع الـ Multer في الباك إند
    if (form.imageFile) fd.append('img', form.imageFile); 
    
    return this.http.post<PlayerResponse>(this.baseUrl, fd);
  }

  updatePlayer(id: string, data: Partial<Player> | FormData): Observable<PlayerResponse> {
    return this.http.patch<PlayerResponse>(`${this.baseUrl}/${id}`, data);
  }

  deletePlayer(id: string): Observable<{ status: string; message: string }> {
    return this.http.delete<{ status: string; message: string }>(`${this.baseUrl}/${id}`);
  }

  /** يحول مسار الصورة النسبي القادم من الباك اند (/uploads/...) لرابط كامل */
  /** يحول مسار الصورة النسبي القادم من الباك اند لرابط كامل مع السيرفر 3500 */
  resolveImage(path: string | null | undefined): string {
    if (!path) return this.placeholderImage();
    
    // إذا كانت الصورة رابطاً كاملاً قادماً من الإنترنت (http/https)
    if (path.startsWith('http')) return path;
    
    // إذا كانت الصورة مخزنة كمسار نسبي، ندمج معها بورت السيرفر الصحيح 3500
    return `http://localhost:3500${path}`;
  }


  /** صورة بديلة (SVG محلي) للاعبين اللي لسه ملهمش صورة، بدل الاعتماد على خدمة خارجية */
  private placeholderImage(): string {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
        <rect width="100%" height="100%" fill="#151515"/>
        <circle cx="150" cy="115" r="55" fill="#333"/>
        <rect x="60" y="190" width="180" height="90" rx="20" fill="#333"/>
      </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }
}
