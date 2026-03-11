import { UserProfile, FoodItem } from './fitness-data';

const PROFILE_KEY = 'fitpal_profile';
const FOOD_LOG_KEY = 'fitpal_food_log';
const WATER_LOG_KEY = 'fitpal_water_log';
const FASTING_LOG_KEY = 'fitpal_fasting_log';
const WORKOUT_LOG_KEY = 'fitpal_workout_log';
const USER_STATS_KEY = 'fitpal_user_stats';

export function saveProfile(profile: UserProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getProfile(): UserProfile | null {
  const data = localStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearProfile() {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(FOOD_LOG_KEY);
  localStorage.removeItem(WATER_LOG_KEY);
  localStorage.removeItem(FASTING_LOG_KEY);
  localStorage.removeItem(WORKOUT_LOG_KEY);
  localStorage.removeItem(USER_STATS_KEY);
}

export interface LoggedFood {
  food: FoodItem;
  quantity: number;
  timestamp: number;
}

export function getTodayFoodLog(): LoggedFood[] {
  const data = localStorage.getItem(FOOD_LOG_KEY);
  if (!data) return [];
  const all: LoggedFood[] = JSON.parse(data);
  const today = new Date().toDateString();
  return all.filter(f => new Date(f.timestamp).toDateString() === today);
}

export function addFoodToLog(food: FoodItem, quantity: number) {
  const data = localStorage.getItem(FOOD_LOG_KEY);
  const all: LoggedFood[] = data ? JSON.parse(data) : [];
  all.push({ food, quantity, timestamp: Date.now() });
  localStorage.setItem(FOOD_LOG_KEY, JSON.stringify(all));
}

export function removeFoodFromLog(timestamp: number) {
  const data = localStorage.getItem(FOOD_LOG_KEY);
  if (!data) return;
  const all: LoggedFood[] = JSON.parse(data);
  const filtered = all.filter(f => f.timestamp !== timestamp);
  localStorage.setItem(FOOD_LOG_KEY, JSON.stringify(filtered));
}

// --- WATER TRACKING ---
export interface WaterLog {
  timestamp: number;
  amountMl: number;
}

export function getTodayWaterLog(): WaterLog[] {
  const data = localStorage.getItem(WATER_LOG_KEY);
  if (!data) return [];
  const all: WaterLog[] = JSON.parse(data);
  const today = new Date().toDateString();
  return all.filter(w => new Date(w.timestamp).toDateString() === today);
}

export function addWater(amountMl: number) {
  const data = localStorage.getItem(WATER_LOG_KEY);
  const all: WaterLog[] = data ? JSON.parse(data) : [];
  all.push({ amountMl, timestamp: Date.now() });
  localStorage.setItem(WATER_LOG_KEY, JSON.stringify(all));
}

// --- INTERMITTENT FASTING ---
export type FastingStatus = 'stopped' | 'fasting';

export interface FastingLog {
  status: FastingStatus;
  startTime: number | null;
  targetHours: number;
}

export function getFastingState(): FastingLog {
  const data = localStorage.getItem(FASTING_LOG_KEY);
  if (data) return JSON.parse(data);
  return { status: 'stopped', startTime: null, targetHours: 16 };
}

export function saveFastingState(state: FastingLog) {
  localStorage.setItem(FASTING_LOG_KEY, JSON.stringify(state));
}

// --- WORKOUT LOGS ---
export interface WorkoutLog {
  exerciseId: string;
  weight: number;
  timestamp: number;
}

export function getWorkoutLogs(): WorkoutLog[] {
  const data = localStorage.getItem(WORKOUT_LOG_KEY);
  return data ? JSON.parse(data) : [];
}

export function addWorkoutLog(exerciseId: string, weight: number) {
  const data = localStorage.getItem(WORKOUT_LOG_KEY);
  const all: WorkoutLog[] = data ? JSON.parse(data) : [];
  all.push({ exerciseId, weight, timestamp: Date.now() });
  localStorage.setItem(WORKOUT_LOG_KEY, JSON.stringify(all));
}

// --- ACHIEVEMENTS & XP ---
export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastLoginDate: string;
}

export function getUserStats(): UserStats {
  const data = localStorage.getItem(USER_STATS_KEY);
  const defaultStats: UserStats = { xp: 0, level: 1, streak: 0, lastLoginDate: '' };
  
  if (!data) return defaultStats;
  
  const stats = JSON.parse(data);
  const today = new Date().toDateString();
  
  // Calculate Streak
  if (stats.lastLoginDate !== today) {
    const lastDate = new Date(stats.lastLoginDate);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastDate.toDateString() === yesterday.toDateString()) {
      stats.streak += 1;
    } else if (stats.lastLoginDate !== '') {
      stats.streak = 1;
    } else {
      stats.streak = 1;
    }
    stats.lastLoginDate = today;
    localStorage.setItem(USER_STATS_KEY, JSON.stringify(stats));
  }
  
  return stats;
}

export function addXP(amount: number) {
  const stats = getUserStats();
  stats.xp += amount;
  
  // XP formula: Level * 100
  const nextLevelXP = stats.level * 100;
  if (stats.xp >= nextLevelXP) {
    stats.xp -= nextLevelXP;
    stats.level += 1;
  }
  
  localStorage.setItem(USER_STATS_KEY, JSON.stringify(stats));
}
