import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminActionResponse, AdminPendingResponse } from '../models/player.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly baseUrl = `${environment.apiUrl}/admin/players`;

  constructor(private http: HttpClient) {}

  getPendingPlayers(): Observable<AdminPendingResponse> {
    return this.http.get<AdminPendingResponse>(`${this.baseUrl}/pending`);
  }

  approvePlayer(id: string): Observable<AdminActionResponse> {
    return this.http.patch<AdminActionResponse>(`${this.baseUrl}/${id}/approve`, {});
  }

  rejectPlayer(id: string): Observable<AdminActionResponse> {
    return this.http.patch<AdminActionResponse>(`${this.baseUrl}/${id}/reject`, {});
  }
}
