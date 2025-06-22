import { writable, get } from "svelte/store";
import type { Recipe } from "$lib/models/recipe";
import { Season } from "$lib/models/season";
import { Unit } from "$lib/models/unit";

function normalizeSeason(value: string): Season {
  const season = value.trim().toLowerCase();
  if (season.includes('autumn') || season.includes('fall')) {
    return Season.Fall;
  }
  switch (season) {
    case 'spring':
      return Season.Spring;
    case 'summer':
      return Season.Summer;
    case 'winter':
      return Season.Winter;
    default:
      return Season.Summer;
  }
}

export class RecipeService {
  // Store to hold recipes
  public recipes = writable<Recipe[]>([]);

  // Load recipes from the JSON file
  public async loadRecipes(): Promise<void> {
    try {
      const response = await fetch("/recipes.json");
      if (!response.ok) {
        throw new Error(`Failed to fetch recipes: ${response.statusText}`);
      }
      const raw = await response.json();
      const data: Recipe[] = raw.map((r: any) => {
        const ingredients = (r.ingredients || []).map((i: any) => {
          const key = String(i.unit ?? '').toLowerCase();
          const unitMap: Record<string, Unit> = {
            g: Unit.Gram,
            ml: Unit.Milliliter,
            l: Unit.Liter,
            el: Unit.Tablespoon,
            tl: Unit.Teaspoon,
            tasse: Unit.Cup,
            zehe: Unit.Clove,
            kopf: Unit.Head,
            stange: Unit.Stalk,
            stk: Unit.Piece,
            none: Unit.None,
          };
          const unit = unitMap[key] ?? Unit.Piece;
          return {
            name: i.name,
            amount: Number(i.amount) || 0,
            unit,
            co2: i.co2 ?? 0,
            price: i.price ?? 0,
          };
        });

        return {
          ...r,
          id: String(r.id),
          season: normalizeSeason(r.season),
          ingredients,
        };
      });
      console.log("Recipes loaded:", data); // Make sure recipes are loaded
      this.recipes.set(data); // Set recipes to the store
    } catch (error) {
      console.error("Error loading recipes:", error);
    }
  }

  // Filter recipes by season and ingredients
  filterBySeasonAndIngredient(season: Season, ingredients: string[]): Recipe[] {
    const recipes = get(this.recipes);
    return recipes.filter(
      (recipe) =>
        recipe.season === season &&
        ingredients.every((ingredient) =>
          recipe.ingredients.some(
            (ing) => ing.name.toLowerCase() === ingredient.toLowerCase()
          )
        )
    );
  }

  // Return all recipes
  getAllRecipes(): Recipe[] {
    return get(this.recipes);
  }

  // Get all ingredients from the recipes
  getAllIngredients(recipes: Recipe[]): string[] {
    const ingredients = recipes.flatMap((r) =>
      r.ingredients.map((i) => i.name)
    );
    return Array.from(new Set(ingredients)); // Remove duplicates
  }

  // Find a recipe by its ID
  getRecipeById(id: string): Recipe | null {
    const recipes = get(this.recipes);
    return recipes.find((recipe) => recipe.id === id) || null;
  }

  // Filter recipes by title
  filterByTitle(query: string): Recipe[] {
    const recipes = get(this.recipes);
    return recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  filterByIngredient(ingredient: string[]): Recipe[] {
    // Placeholder for ingredient filtering logic
    throw new Error("Method not implemented.");
  }
}
