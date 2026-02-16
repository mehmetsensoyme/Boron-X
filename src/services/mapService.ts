import { CafeWithPrices } from '@/types';

export const mapService = {
  async fetchNearbyCafes(lat: number, lon: number, radius: number = 2000): Promise<CafeWithPrices[]> {
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="cafe"](around:${radius},${lat},${lon});
        way["amenity"="cafe"](around:${radius},${lat},${lon});
        relation["amenity"="cafe"](around:${radius},${lat},${lon});
      );
      out center;
    `;

    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
        // Timeout kontrolü için sinyal eklenebilir
      });

      if (!response.ok) {
        console.warn('Overpass API returned non-OK status. Falling back to empty results.');
        return [];
      }
      
      const data = await response.json();

      if (!data || !data.elements) return [];

      return data.elements.map((el: any) => ({
        id: el.id.toString(),
        name: el.tags.name || 'İsimsiz Kafe',
        latitude: el.lat || el.center?.lat,
        longitude: el.lon || el.center?.lon,
        address: el.tags['addr:street'] ? `${el.tags['addr:street']} ${el.tags['addr:housenumber'] || ''}` : 'Adres bilgisi yok',
        website: el.tags.website || '',
        prices: [],
        created_at: new Date().toISOString()
      })).filter((cafe: any) => cafe.latitude && cafe.longitude);
    } catch (error) {
      console.error('Overpass API critical error:', error);
      return [];
    }
  }
};
