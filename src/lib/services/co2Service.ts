export class Co2Service {
  private async fetchCo2Per100g(name: string): Promise<number> {
    const query = encodeURIComponent(name);
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&json=true&page_size=1&fields=carbon-footprint-from-known-ingredients_100g`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error('Failed to fetch CO2 data', res.status);
        return 0;
      }
      const data = await res.json();
      const product = data.products?.[0];
      const value = product?.['carbon-footprint-from-known-ingredients_100g'];
      return typeof value === 'number' ? value : 0;
    } catch (err) {
      console.error('Error fetching CO2 data', err);
      return 0;
    }
  }

  private convertToGrams(amount: number, unit: string): number {
    switch (unit) {
      case 'g':
        return amount;
      case 'ml':
        return amount; // rough approximation
      case 'l':
        return amount * 1000;
      case 'EL':
        return amount * 15;
      case 'TL':
        return amount * 5;
      case 'Tasse':
        return amount * 240;
      case 'Stk':
      case 'Zehe':
      case 'Kopf':
      case 'Stange':
        return amount * 100; // generic estimate
      default:
        return amount;
    }
  }

  public async calculateRecipeCo2(recipe: any): Promise<number> {
    let total = 0;
    for (const ingredient of recipe.ingredients) {
      const per100g = await this.fetchCo2Per100g(ingredient.name);
      const amount = this.convertToGrams(ingredient.amount, ingredient.unit);
      total += (per100g * amount) / 100;
    }
    return total;
  }
}
