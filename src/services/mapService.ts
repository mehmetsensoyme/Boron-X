import { CafeWithPrices } from '@/types';

export const mapService = {
  // Belirli bir koordinatın çevresindeki kafeleri getir (OpenStreetMap Overpass API)
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
        body: query
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      return data.elements.map((el: any) => ({
        id: el.id.toString(),
        name: el.tags.name || 'İsimsiz Kafe',
        latitude: el.lat || el.center.lat,
        longitude: el.lon || el.center.lon,
        address: el.tags['addr:street'] ? `${el.tags['addr:street']} ${el.tags['addr:housenumber'] || ''}` : 'Adres bilgisi yok',
        website: el.tags.website || '',
        prices: [], // API'den fiyat gelmez, bunlar bizim DB'den gelecek
        created_at: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Overpass API error:', error);
      return [];
    }
  }
};
