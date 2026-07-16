import { Routes } from '@angular/router';
import { PlayerList } from './features/players/player-list/player-list';
import { PlayerProfile } from './features/players/player-profile/player-profile';
import { AdminPending } from './features/admin/admin-pending/admin-pending';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', component: PlayerList },
  { path: 'players/:id', component: PlayerProfile },
  {
    path: 'admin/pending',
    component: AdminPending,
    canActivate: [roleGuard('admin')],
  },
  { path: '**', redirectTo: '' },
];
