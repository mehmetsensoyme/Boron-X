// Mock Data for Development
export const MOCK_PENDING = [
  { id: 'p-1', cafeName: 'Starbucks Beşiktaş', itemName: 'Latte Grande', price: 125, currency: 'TRY', user: 'ahmet@demo.com', date: '2024-02-16' },
  { id: 'p-2', cafeName: 'Espresso Lab Ortaköy', itemName: 'Cortado', price: 95, currency: 'TRY', user: 'mehmet@demo.com', date: '2024-02-16' },
];

export const DEFAULT_RATES = { 
  "TRY": 31.2, 
  "USD": 1, 
  "EUR": 0.92, 
  "GBP": 0.78 
};

export const INITIAL_MAP_CENTER: [number, number] = [41.0082, 28.9784];

export const APP_CONFIG = {
  VERSION: 'v0.1.8-beta',
  RELEASE_NOTES: [
    // v0.1.8-beta
    'Konum bulma (Geolocation) sistemi daha esnek ve hataya dayanıklı hale getirildi.',
    'Yazılımsal veri çakışmaları (Source of Truth) giderilerek harita senkronizasyonu mükemmelleştirildi.',
    'Masaüstü kullanıcıları için devasa duran ikon ve bileşen boyutları rafine edildi.',
    'Branding yapısı "BORON-X" marka ismini ve dikey sloganı koruyacak şekilde birleştirildi.',
    'Gelişmiş hata yönetimi ve kullanıcı bilgilendirme mesajları eklendi.',
    // v0.1.7-beta
    'Kullanıcı dostu "Arayüz Ölçeklendirme" (UI Scaling) sistemi eklendi.',
    '"Infinity Map" tasarımı ile tam ekran harita deneyimine geçildi.',
    'Dikey Branding (Stacked Slogan) ile marka kimliği güçlendirildi.',
    'Zarif ve akışkan (smooth) logo hover animasyonları eklendi.',
    // v0.1.6-beta
    'Akıllı "Dijital Menü Dedektörü" entegre edildi.',
    'Kümülatif İndeksleme (Dinamik Mekan Keşfi) özelliği eklendi.',
    'Arama sonuçlarının filtreler üzerine binmesi (Z-Index) sorunu giderildi.',
    'Harita stabilitesi ve marker render performansı optimize edildi.'
  ]
};
