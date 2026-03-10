import { UserProfile, FoodItem } from './fitness-data';

const PROFILE_KEY = 'fitpal_profile';
const FOOD_LOG_KEY = 'fitpal_food_log';

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
