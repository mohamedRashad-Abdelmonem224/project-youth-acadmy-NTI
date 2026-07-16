export type PlayerPosition = 'ST' | 'CM' | 'CB' | 'GK' | 'RB';
export type PlayerStatus = 'pending' | 'approved' | 'rejected';

export interface PlayerStats {
  goals: number;
  assists: number;
  matches: number;
  injuries: number;
}

export interface Player {
  _id: string;
  name: string;
  team: string;
  position: PlayerPosition;
  img: string;
  video: string;
  stats: PlayerStats;
  rating: number[]; // 5 seasons of ratings, oldest -> newest
  status: PlayerStatus;
  submittedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlayersResponse {
  status: string;
  count: number;
  data: { players: Player[] };
}

export interface PlayerResponse {
  status: string;
  data: { player: Player };
}

// ملاحظة: كنترولر الأدمن (admin-controller.js) بيرجّع شكل استجابة مختلف
// عن كنترولر اللاعبين العادي (بدون تغليف داخل data)
export interface AdminPendingResponse {
  status: string;
  count: number;
  players: Player[];
}

export interface AdminActionResponse {
  message: string;
  player: Player;
}
