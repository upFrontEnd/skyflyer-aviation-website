const icon = (path) =>
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`

export const setupItems = {
  left: [
    {
      id: 'cpu',
      icon: icon('<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M9 7V3M12 7V3M15 7V3M9 21v-4M12 21v-4M15 21v-4M7 9H3M7 12H3M7 15H3M21 9h-4M21 12h-4M21 15h-4"/>'),
      category: { fr: 'Processeur', en: 'Processor' },
      name: 'AMD Ryzen 9 9950X',
      specs: '16 cœurs · 5.7 GHz boost',
    },
    {
      id: 'gpu',
      icon: icon('<rect x="2" y="8" width="20" height="10" rx="2"/><path d="M7 8V5M12 8V5M17 8V5"/><rect x="5" y="10.5" width="3.5" height="4" rx="0.5"/><rect x="10" y="10.5" width="3.5" height="4" rx="0.5"/>'),
      category: { fr: 'Carte graphique', en: 'Graphics card' },
      name: 'NVIDIA RTX 4080 Super',
      specs: '16 Go GDDR6X',
    },
    {
      id: 'ram',
      icon: icon('<rect x="3" y="6" width="18" height="11" rx="2"/><path d="M8 6V4M12 6V4M16 6V4M8 17v2M16 17v2"/><line x1="8" y1="11" x2="8" y2="13"/><line x1="12" y1="11" x2="12" y2="13"/><line x1="16" y1="11" x2="16" y2="13"/>'),
      category: { fr: 'Mémoire vive', en: 'RAM' },
      name: '64 Go DDR5',
      specs: '6 000 MHz · Kingston Fury',
    },
    {
      id: 'storage',
      icon: icon('<rect x="2" y="6" width="20" height="12" rx="3"/><line x1="6" y1="10" x2="10" y2="10"/><line x1="6" y1="13" x2="10" y2="13"/><circle cx="17" cy="12" r="2.5"/>'),
      category: { fr: 'Stockage', en: 'Storage' },
      name: 'Samsung 990 Pro 2 To',
      specs: 'NVMe PCIe 4.0',
    },
  ],
  right: [
    {
      id: 'monitor',
      icon: icon('<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>'),
      category: { fr: 'Écran', en: 'Monitor' },
      name: 'LG 27GR95QE 27"',
      specs: '1440p · 240 Hz · OLED',
    },
    {
      id: 'hotas',
      icon: icon('<path d="M12 3v5"/><circle cx="12" cy="4" r="1.5"/><path d="M9.5 8c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5v3.5"/><rect x="6.5" y="11.5" width="11" height="8" rx="3"/><line x1="9.5" y1="16.5" x2="14.5" y2="16.5"/>'),
      category: { fr: 'Joystick / HOTAS', en: 'Joystick / HOTAS' },
      name: 'Thrustmaster TCA Capt. Pack',
      specs: 'Airbus Edition',
    },
    {
      id: 'pedals',
      icon: icon('<path d="M4 20h16"/><rect x="3" y="13" width="7" height="7" rx="2"/><rect x="14" y="13" width="7" height="7" rx="2"/><path d="M5.5 13V9.5L7.5 5M18.5 13V9.5L16.5 5"/>'),
      category: { fr: 'Pédalier', en: 'Rudder pedals' },
      name: 'Thrustmaster TFRP',
      specs: 'T.Flight Rudder Pedals',
    },
    {
      id: 'headset',
      icon: icon('<path d="M3 12a9 9 0 0 1 18 0"/><path d="M3 12v3a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3"/><path d="M21 12v3a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3"/>'),
      category: { fr: 'Casque audio', en: 'Headset' },
      name: 'Sennheiser HD 599',
      specs: 'Open-back · 50 Ω',
    },
  ],
}
