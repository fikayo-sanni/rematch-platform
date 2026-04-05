// ==================== CORE TYPES ====================

export interface Credits {
  rc: number; // Rank Credits
  bc: number; // Boost Credits
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  reputation: number;
  xp: number;
  level: number;
  credits: Credits;
  createdAt: Date;
  isOnline: boolean;
}

export interface Edition {
  id: string;
  name: string;
  year: number;
  isDefault: boolean;
}

export interface Guild {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  banner?: string;
  description?: string;
  editions: Edition[];
  memberCount: number;
  activeNow: number;
  accentColor: string;
}

// ==================== MATCH TYPES ====================

export type MatchType = 'pull' | 'call';
export type MatchStatus =
  | 'pending'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'disputed'
  | 'cancelled';

export interface MatchResult {
  winnerId: string;
  loserId: string;
  winnerScore: number;
  loserScore: number;
  duration: number; // in minutes
}

export interface MatchContext {
  type: 'challenge' | 'tournament' | 'league';
  id: string;
  name: string;
}

export interface Match {
  id: string;
  type: MatchType;
  guildId: string;
  editionId: string;
  player1: User;
  player2: User;
  status: MatchStatus;
  creditPot: number;
  createdAt: Date;
  startedAt?: Date;
  scheduledAt?: Date;
  completedAt?: Date;
  result?: MatchResult;
  context?: MatchContext;
}

// ==================== PULL (Quick Match) ====================

export type PullStatus = 'pending' | 'accepted' | 'expired' | 'declined';

export interface Pull {
  id: string;
  guildId: string;
  editionId: string;
  initiator: User;
  opponent?: User;
  creditPot: number;
  status: PullStatus;
  createdAt: Date;
  expiresAt: Date;
}

// ==================== CALL (Challenge) ====================

export type CallStatus = 'pending' | 'accepted' | 'declined' | 'expired';

export interface Call {
  id: string;
  guildId: string;
  editionId: string;
  challenger: User;
  challenged: User;
  creditPot: number;
  message?: string;
  status: CallStatus;
  createdAt: Date;
  expiresAt: Date;
}

// ==================== RUN (Tournament) ====================

export type RunType = 'daily' | 'weekend' | 'crew' | 'rank_push' | 'special';

export interface Run {
  id: string;
  name: string;
  type: RunType;
  guildId: string;
  editionId: string;
  creditPot: number;
  participantCount: number;
  maxParticipants: number;
  participants: User[];
  startsAt: Date;
  endsAt: Date;
  isActive: boolean;
  winner?: User;
}

// ==================== LEAGUE ====================

export type LeagueType = 'round_robin' | 'knockout' | 'swiss';
export type LeagueStatus = 'upcoming' | 'active' | 'completed';

export interface LeagueStanding {
  userId: string;
  user: User;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface League {
  id: string;
  name: string;
  type: LeagueType;
  guildId: string;
  editionId: string;
  status: LeagueStatus;
  entryFee: number;
  prizePool: number;
  participantCount: number;
  maxParticipants: number;
  matchesPerPlayer: number;
  participants: User[];
  standings: LeagueStanding[];
  startsAt: Date;
  endsAt: Date;
  winner?: User;
}

// ==================== CREW (Team) ====================

export interface Crew {
  id: string;
  name: string;
  tag: string; // Short identifier (e.g., "NITE")
  logo?: string;
  description?: string;
  leaderId: string;
  members: User[];
  memberCount: number;
  wins: number;
  losses: number;
  rank: number;
  createdAt: Date;
}

// ==================== RANKBOARD ====================

export interface RankEntry {
  rank: number;
  user: User;
  wins: number;
  losses: number;
  creditsEarned: number;
  winStreak: number;
  change: number; // +/- rank change
}

// ==================== NOISE (Feed) ====================

export interface NoisePost {
  id: string;
  author: User;
  content: string;
  image?: string;
  clipUrl?: string;
  guildId?: string;
  likes: number;
  replies: number;
  isLiked: boolean;
  mentions: string[]; // usernames
  createdAt: Date;
}

export interface NoiseReply {
  id: string;
  postId: string;
  author: User;
  content: string;
  likes: number;
  isLiked: boolean;
  createdAt: Date;
}

// ==================== SPOTCHECK (Dispute) ====================

export type SpotcheckStatus = 'pending' | 'reviewing' | 'resolved' | 'escalated';

export interface SpotcheckEvidence {
  type: 'screenshot' | 'video';
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface SpotcheckClaim {
  playerId: string;
  claimedScore: {
    player: number;
    opponent: number;
  };
}

export interface Spotcheck {
  id: string;
  matchId: string;
  match: Match;
  status: SpotcheckStatus;
  evidence: SpotcheckEvidence[];
  player1Claim: SpotcheckClaim;
  player2Claim: SpotcheckClaim;
  assignedTo?: string;
  resolvedBy?: string;
  resolution?: {
    winnerId: string;
    finalScore: {
      winner: number;
      loser: number;
    };
    notes?: string;
  };
  createdAt: Date;
  resolvedAt?: Date;
}

// ==================== NOTIFICATIONS ====================

export type NotificationType =
  | 'match_found'
  | 'challenge_received'
  | 'challenge_accepted'
  | 'match_ready'
  | 'match_result'
  | 'verification_request'
  | 'tournament_update'
  | 'league_update'
  | 'feed_mention'
  | 'team_invite'
  | 'team_update';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, any>;
  createdAt: Date;
}

// ==================== ACHIEVEMENTS ====================

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

// ==================== LIVE MATCH ====================

export interface LiveMatch {
  id: string;
  matchId: string;
  player1: User;
  player2: User;
  score: {
    player1: number;
    player2: number;
  };
  viewers: number;
  duration: string;
  guildId: string;
  editionId: string;
}

// ==================== USER STATS ====================

export interface UserStats {
  userId: string;
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
  totalPlayTime: number; // in minutes
  creditsEarned: number;
  tournamentWins: number;
  matchTypeBreakdown: {
    type: string;
    matches: number;
    wins: number;
    winRate: number;
  }[];
}

// ==================== ACTIVITY ====================

export type ActivityType =
  | 'match_won'
  | 'match_lost'
  | 'rank_achieved'
  | 'guild_joined'
  | 'crew_joined'
  | 'tournament_won'
  | 'achievement_unlocked';

export interface Activity {
  id: string;
  userId: string;
  user: User;
  type: ActivityType;
  description: string;
  data?: Record<string, any>;
  createdAt: Date;
}
