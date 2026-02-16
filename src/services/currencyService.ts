export const currencyService = {
  // Anlık kurları getir (Örn: USD tabanlı)
  async getExchangeRates(baseCurrency: string = 'USD') {
    try {
      // Not: Gerçek bir API anahtarı gerektiğinde buraya eklenir. 
      // Şimdilik ücretsiz tier veya fallback verisi kullanıyoruz.
      const response = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
      if (!response.ok) throw new Error('Currency API error');
      const data = await response.json();
      return data.rates;
    } catch (error) {
      console.error('Currency Fetch Error:', error);
      return { "TRY": 31.20, "EUR": 0.92, "USD": 1, "GBP": 0.79 }; // Fallback
    }
  },

  convert(price: number, from: string, to: string, rates: any) {
    if (!rates || from === to) return price;
    const priceInBase = price / rates[from];
    return priceInBase * rates[to];
  }
};
