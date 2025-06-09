<script lang="ts">
  import { RecipeService } from "$lib/services/recipeService";
  import type { Recipe } from "$lib/models/recipe";
  import { Season, SeasonDisplay } from "$lib/models/season";
  import { onMount } from "svelte";
  import Header from "./Header.svelte";
  import Footer from "./Footer.svelte";

  let recipes: Recipe[] = [];
  let ingredients: string[] = [];
  let selectedSeason: Season = Season.Summer;
  let selectedIngredients: string[] = [];
  let recipeService: RecipeService = new RecipeService();
  let selectedRecipe: Recipe | null = null;

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
    { label: "Herbst", value: Season.Fall },
    { label: "Winter", value: Season.Winter },
  ];

  const handleChange = (season: Season) => {
    updateRecipesAndIngredients(season, []);
    loadRecipes(season, []);
  };

  const openModal = (recipe: Recipe) => {
    selectedRecipe = recipe;
  };

  const closeModal = () => {
    selectedRecipe = null;
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
        <div class="card h-100 shadow-sm" role="button" style="cursor:pointer" on:click={() => openModal(recipe)}>
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
            <span class="badge bg-secondary">{SeasonDisplay[recipe.season]}</span>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

{#if selectedRecipe}
  <div class="modal fade show" tabindex="-1" style="display:block; background-color: rgba(0,0,0,0.5);" on:click|self={closeModal}>
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{selectedRecipe.title}</h5>
          <button type="button" class="btn-close" aria-label="Schließen" on:click={closeModal}></button>
        </div>
        <div class="modal-body">
          <div class="text-center mb-3">
            <img
              src={selectedRecipe.image == null ? '/images/default.jpeg' : getImage(selectedRecipe.image)}
              class="img-fluid rounded"
              alt="Bild vom Rezept"
            />
            <div class="d-flex justify-content-center gap-2 mt-2">
              {#if selectedRecipe.duration}<span class="badge bg-info">{selectedRecipe.duration}</span>{/if}
              {#if selectedRecipe.difficulty}<span class="badge bg-warning">{selectedRecipe.difficulty}</span>{/if}
              <span class="badge bg-secondary">{SeasonDisplay[selectedRecipe.season]}</span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-8">
              <p>{selectedRecipe.description}</p>
              {#if selectedRecipe.instructions}
                <h6 class="mt-3">Anleitung</h6>
                <p>{selectedRecipe.instructions}</p>
              {/if}
            </div>
            <div class="col-md-4">
              <ul class="list-group">
                <li class="list-group-item d-flex justify-content-between"><span>Kalorien</span><span></span></li>
                <li class="list-group-item d-flex justify-content-between"><span>Preis</span><span></span></li>
                <li class="list-group-item d-flex justify-content-between"><span>CO₂</span><span>{selectedRecipe.totalCo2?.toFixed(2)} g</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" on:click={closeModal}>Schließen</button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Footer -->
<Footer />

