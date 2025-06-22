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
  let portionen: number = 1;


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
      portionen = 1; // immer mit 1 Portion starten
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
       class="btn {selectedSeason === value
         ? `season-${value.toLowerCase()}`
         : 'outline-season'}"
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
        <div
          class="card h-100 shadow-sm" 
          role="button" 
          tabindex="0"
          on:click={() => openModal(recipe)}
          on:keydown={(e: KeyboardEvent) => e.key === 'Enter' && openModal(recipe)}
          style="cursor:pointer" 
        >
        <img
          src={recipe.image ?? "/images/default.jpeg"}
          alt="Bild vom Rezept"
          class="card-img-top"
          style="height: 200px; object-fit: cover;"
         />
        <div class="card-body">
            <h5 class="card-title">{recipe.title}</h5>
            <p class="card-text">{recipe.description}</p>
            <span class="badge bg-secondary">
              {SeasonDisplay[recipe.season]}
            </span>
        </div>
      </div>
    </div>
    {/each}
  </div>
</div>

{#if selectedRecipe}
  <div
   class="modal fade show" 
   tabindex="-1" 
   role="button"
   style="display:block; background-color: rgba(0,0,0,0.5);" 
   on:click|self={closeModal}
   on:keydown|self={(e) => e.key === 'Escape' && closeModal()}
  >
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{selectedRecipe.title}</h5>
          <button type="button" class="btn-close" aria-label="Schließen" on:click={closeModal}></button>
        </div>
        <div class="modal-body">
          <div class="text-center mb-3">
          <img
           src={selectedRecipe.image ?? '/images/default.jpeg'}
           class="img-fluid rounded"
           style="height: 250px; object-fit: cover; width: 100%;"
            alt={selectedRecipe.title}
          />
            <div class="d-flex justify-content-center gap-2 mt-2">
              {#if selectedRecipe.duration}
              <span class="badge bg-info">{selectedRecipe.duration}</span>
              {/if}
              {#if selectedRecipe.difficulty}
              <span class="badge bg-warning">{selectedRecipe.difficulty}</span>
              {/if}
              <span class="badge bg-secondary">
                {SeasonDisplay[selectedRecipe.season]}
              </span>
         </div>
          <div class="d-flex align-items-center gap-2 mb-3">
          <strong>Portionen:</strong>
          <button class="btn btn-sm btn-outline-secondary" on:click={() => portionen = Math.max(1, portionen - 1)}>-</button>
         <span>{portionen}</span>
          <button class="btn btn-sm btn-outline-secondary" on:click={() => portionen++}>+</button>
         </div>
       </div>

          <div class="row">
            <div class="col-md-8">
             {#if selectedRecipe.description}
               <h6 class="mt-3">Beschreibung</h6>
               <p>{selectedRecipe.description}</p>
             {/if}

            {#if selectedRecipe.ingredients}
              <h6 class="mt-3">Zutaten</h6>
              <ul>
               {#each selectedRecipe.ingredients as zutat}
                <li>
                  {zutat.amount > 0 && selectedRecipe?.servings && selectedRecipe.servings > 0
                   ? `${(zutat.amount * portionen / selectedRecipe.servings).toFixed(1)} ${zutat.unit} `
                   : ''} {zutat.name}
                </li>
               {/each} 
              </ul>
             {/if}

             {#if selectedRecipe.preparationTime}
               <h6 class="mt-3">Zubereitungszeit</h6>
               <p>{selectedRecipe.preparationTime} Minuten</p>
             {/if}

             {#if selectedRecipe.instructions}
               <h6 class="mt-3">Anleitung</h6>
               <p>{selectedRecipe.instructions}</p>
             {/if}
            </div>

            <div class="col-md-4">
              <ul class="list-group">
                <li class="list-group-item d-flex justify-content-between"><span>Kalorien</span><span></span>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span>Preis</span><span></span>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span>CO₂</span><span></span>
                </li>
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

