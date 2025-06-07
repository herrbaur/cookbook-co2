import { Unit } from './unit';

export interface Ingredient {
  name: string;
  amount: number;
  unit: Unit; // e.g. 'g', 'ml', 'Stk', 'EL', 'TL', 'Tasse'
  co2: number;
  price: number;
}
