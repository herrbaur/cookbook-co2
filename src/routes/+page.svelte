<script lang="ts">
  import { RecipeService } from '$lib/services/recipeService';
  import type { Recipe } from '$lib/models/recipe';
  import { Season } from '$lib/models/season';

  const recipeService = new RecipeService();

  let recipes: Recipe[] = [];
  let searchQuery: string = '';
  let selectedSeason: Season | null = null;

  // Rezepte laden und filtern
  const loadRecipes = () => {
    // Null-Überprüfung, um sicherzustellen, dass season immer gesetzt ist
    recipes = recipeService.getAllRecipes().filter(recipe => recipe.season !== null && recipe.season !== undefined);
  };

  // Saisonfilter anwenden
  const filterBySeason = (season: Season) => {
    recipes = recipeService.filterBySeason(season);
  };

  // Saison auswählen
  const handleSeasonChange = (e: Event) => {
    const target = e.target as HTMLSelectElement; // Type Assertion
    selectedSeason = target.value as Season; // sicherstellen, dass es immer eine gültige Saison ist
    if (selectedSeason) {
      filterBySeason(selectedSeason);
    } else {
      loadRecipes(); // Alle Rezepte laden, wenn keine Saison ausgewählt ist
    }
  };

  loadRecipes();
</script>

<!-- Suchfeld -->
<input type="text" bind:value={searchQuery} placeholder="Suche nach Rezepten" on:input={loadRecipes} />

<!-- Saison-Filter -->
<select on:change={handleSeasonChange}>
  <option value="spring">Frühling</option>
  <option value="summer">Sommer</option>
  <option value="autumn">Herbst</option>
  <option value="winter">Winter</option>
</select>

<!-- Rezeptliste anzeigen -->
{#each recipes as recipe}
  <div class="card mb-3">
    <div class="card-body">
      <h5 class="card-title">{recipe.title}</h5>
      <p class="card-text">{recipe.description}</p>
    </div>
  </div>
{/each}
