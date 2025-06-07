import { Season } from './season';
import type { Ingredient } from './ingredient';

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  ingredients: Ingredient[];
  season: Season; // Jetzt Season statt string
  image?: string;
  totalCo2?: number;
  totalPrice?: number;
}
