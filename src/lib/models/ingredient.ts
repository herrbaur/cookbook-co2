import { Unit } from './unit';

export interface Ingredient {
  name: string;
  amount: number;
  unit: Unit; // Uses Unit enum for all measurements
  co2: number;
  price: number;
}
