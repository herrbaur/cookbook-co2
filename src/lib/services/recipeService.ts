import { writable } from "svelte/store";
import type { Recipe } from "$lib/models/recipe";
import { Season } from "$lib/models/season";

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
      const data: Recipe[] = await response.json();
      console.log("Recipes loaded:", data);  // Make sure recipes are loaded
      this.recipes.set(data); // Set recipes to the store
    } catch (error) {
      console.error("Error loading recipes:", error);
    }
  }

  // Filter recipes by season and ingredients
  filterBySeasonAndIngredient(season: Season, ingredients: string[]): Recipe[] {
    let result: Recipe[] = [];
    
    // Subscribe to recipes store to get the current recipes
    this.recipes.subscribe((recipes) => {
      result = recipes.filter(
        (recipe) =>
          recipe.season === season &&
          ingredients.every((ingredient) =>
            recipe.ingredients.some(
              (ing) => ing.name.toLowerCase() === ingredient.toLowerCase()
            )
          )
      );
    });

    return result;
  }

  // Return all recipes
  getAllRecipes(): Recipe[] {
    let allRecipes: Recipe[] = [];
    
    // Subscribe to recipes store to get the current recipes
    this.recipes.subscribe((recipes) => {
      allRecipes = recipes;
    });

    return allRecipes;
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
    let recipe: Recipe | null = null;
    
    // Subscribe to recipes store to get the current recipes
    this.recipes.subscribe((recipes) => {
      recipe = recipes.find((recipe) => recipe.id === id) || null;
    });

    return recipe;
  }

  // Filter recipes by title
  filterByTitle(query: string): Recipe[] {
    let result: Recipe[] = [];
    
    // Subscribe to recipes store to get the current recipes
    this.recipes.subscribe((recipes) => {
      result = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(query.toLowerCase())
      );
    });

    return result;
  }

  filterByIngredient(ingredient: string[]): Recipe[] {
    // Placeholder for ingredient filtering logic
    throw new Error("Method not implemented.");
  }
}
