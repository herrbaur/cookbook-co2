<script lang="ts">
  import { RecipeService } from "$lib/services/recipeService";
  import type { Recipe } from "$lib/models/recipe";
  import { Season } from "$lib/models/season";
  import { onMount } from "svelte";
  import Header from "./Header.svelte";
  import Footer from "./Footer.svelte";

  let recipes: Recipe[] = [];
  let ingredients: string[] = [];
  let selectedSeason: Season = Season.Summer;
  let selectedIngredients: string[] = [];
  let recipeService: RecipeService = new RecipeService();

  onMount( async () => {
    // Initial laden nach default-Saison
    await recipeService.loadRecipes();
    recipeService.recipes.subscribe((data) => {
      recipes = data;
    });
    updateRecipesAndIngredients(selectedSeason, selectedIngredients);
    
    
  });

  const getImage = (imagePath: string): string => {
    // Hier wird der Pfad zum Bild generiert
    return `/images/${imagePath}`;
  };

  // Rezepte laden und filtern
  const loadRecipes = (
    season: Season = selectedSeason,
    ingredients: string[] = selectedIngredients
  ) => {
    recipes = recipeService.filterBySeasonAndIngredient(season, ingredients);
    ingredients = recipeService.getAllIngredients(recipes);
  };

  const updateRecipesAndIngredients = (season: Season, selected: string[]) => {
    selectedSeason = season;
    selectedIngredients = selected;

    // Rezepte filtern
    recipes = recipeService.filterBySeasonAndIngredient(season, selected);

    // Zutatenliste aus gefilterten Rezepten extrahieren
    ingredients = recipeService.getAllIngredients(recipes);
  };

  // Saisonfilter anwenden
  const filterBySeasonAndIngredient = (
    season: Season,
    ingredients: string[]
  ) => {
    recipes = recipeService.filterBySeasonAndIngredient(season, ingredients);
    ingredients = recipeService.getAllIngredients(recipes);
  };

  // Saison auswählen
  const seasons: { label: string; value: Season }[] = [
    { label: "Frühling", value: Season.Spring },
    { label: "Sommer", value: Season.Summer },
    { label: "Herbst", value: Season.Autumn },
    { label: "Winter", value: Season.Winter },
  ];

  const handleChange = (season: Season) => {
    updateRecipesAndIngredients(season, []);
    loadRecipes(season, []);
  };
</script>

<!-- Header -->
<Header />

<!-- Saison-Filter -->
<div class="d-flex justify-content-center my-3 gap-2 flex-wrap">
  {#each seasons as { label, value }}
    <button
      class="btn"
      class:selected={selectedSeason === value}
      class:btn-primary={selectedSeason === value}
      class:btn-outline-primary={selectedSeason !== value}
      on:click={() => handleChange(value)}
    >
      {label}
    </button>
  {/each}
</div>

<!-- Zutaten-Filter -->
<div class="d-flex justify-content-center my-3 gap-2 flex-wrap">
  {#each ingredients as ingredient}
    <button
      class="btn"
      class:selected={selectedIngredients.includes(ingredient)}
      class:btn-primary={selectedIngredients.includes(ingredient)}
      class:btn-outline-primary={!selectedIngredients.includes(ingredient)}
      on:click={() => {
        if (selectedIngredients.includes(ingredient)) {
          selectedIngredients = selectedIngredients.filter(
            (i) => i !== ingredient
          );
        } else {
          selectedIngredients = [...selectedIngredients, ingredient];
        }
        updateRecipesAndIngredients(selectedSeason, selectedIngredients);
      }}
    >
      {ingredient}
    </button>
  {/each}
</div>

<!-- Recipe List -->
<div class="container">
  <div class="row">
    {#each recipes as recipe}
      <div class="col-md-4 mb-4 d-flex justify-content-center">
        <div class="card h-100 shadow-sm">
          <img
            src={recipe.image == null
              ? "/images/default.jpeg"
              : getImage(recipe.image)}
            class="card-img-top"
            alt="Bild vom Rezept"
          />
          <div class="card-body">
            <h5 class="card-title">{recipe.title}</h5>
            <p class="card-text">{recipe.description}</p>
            <span class="badge bg-secondary">{recipe.season}</span>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<!-- Footer -->
<Footer />

