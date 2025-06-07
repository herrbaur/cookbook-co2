// src/lib/services/recipeService.ts
import type { Recipe } from '$lib/models/recipe';
import { Season } from '$lib/models/season';
import { Unit } from '$lib/models/unit';

export class RecipeService {
  // Beispiel-Datenquelle (könnte später aus einer API oder localStorage kommen)
  private recipes: Recipe[] = [
    {
      id: '1',
      title: 'Tomatensalat',
      description: 'Ein frischer Salat für den Sommer.',
      season: Season.Summer,
      ingredients: [
        { name: 'Tomaten', amount: 300, unit: Unit.Gram, co2: 200, price: 1.5 },
        { name: 'Olivenöl', amount: 2, unit: Unit.Tablespoon, co2: 50, price: 0.2 },
      ],
    },
    {
      id: '2',
      title: 'Kürbiscremesuppe',
      description: 'Ein wärmendes Gericht für den Herbst.',
      season: Season.Autumn,
      ingredients: [
        { name: 'Kürbis', amount: 500, unit: Unit.Gram, co2: 300, price: 2.0 },
        { name: 'Sahne', amount: 100, unit: Unit.Milliliter, co2: 100, price: 0.5 },
      ],
    },
  ];

  // Rezepte filtern nach Saison
  filterBySeason(season: Season): Recipe[] {
    return this.recipes.filter(recipe => recipe.season === season);
  }

  // Alle Rezepte zurückgeben
  getAllRecipes(): Recipe[] {
    return this.recipes;
  }

  // Ein Rezept anhand seiner ID finden
  getRecipeById(id: string): Recipe | undefined {
    return this.recipes.find(recipe => recipe.id === id);
  }

  // Rezept nach Titel filtern
  filterByTitle(query: string): Recipe[] {
    return this.recipes.filter(recipe => recipe.title.toLowerCase().includes(query.toLowerCase()));
  }
}
