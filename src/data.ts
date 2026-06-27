import { Product } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "sonicpro-headphones",
    name: "Pro-Grade Wireless Headphones X1",
    description: "Experience audiophile-grade sound with our next-generation active noise cancellation. The X1 features custom 50mm titanium drivers, plush memory foam earcups, and up to 40 hours of battery life on a single charge. Precision-tuned titanium-coated diaphragms provide ultra-fast transient response and minimize distortion even at high volumes. A 6-microphone array constantly analyzes ambient noise, neutralizing low-frequency rumble and mid-band chatter before it reaches your ears.",
    price: 299.00,
    originalPrice: 349.00,
    rating: 4.8,
    reviewCount: 1284,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsuYUTzlDadN5wBplsSFJZum-wl3anmKyAkvSKh9_tdXydFwBF3TjR1glNvwxdwFxfZX_cbYe0TGZwHyQdLbaKPxzwEaAjSTA96GhHFCWKsiHbjNtWsdkQkxBF708MhJMHOiQVNsroeX-JWHkG8jrFqge7IZ4SAbKr2xIHTs6BikdNb4r1eklOzrBBJu0YYmehC3Z-m9a1rIHnl_bozW5HO6GFdI325vTU1P9gjJm3n4XhXSJdx14Ks9aUATegl-G1pl6udO-f5w",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAsuYUTzlDadN5wBplsSFJZum-wl3anmKyAkvSKh9_tdXydFwBF3TjR1glNvwxdwFxfZX_cbYe0TGZwHyQdLbaKPxzwEaAjSTA96GhHFCWKsiHbjNtWsdkQkxBF708MhJMHOiQVNsroeX-JWHkG8jrFqge7IZ4SAbKr2xIHTs6BikdNb4r1eklOzrBBJu0YYmehC3Z-m9a1rIHnl_bozW5HO6GFdI325vTU1P9gjJm3n4XhXSJdx14Ks9aUATegl-G1pl6udO-f5w",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBWBvkAon3dnQWiWMEDRGAMi_mJAdBeDxXt0qloeZuy1mXxwkzLjXAs3LFGVjFybeMKjPQq0vyjWKLwiR125R78UBgkPQ2fkZUI1XESXdgctHDLldZOFoGfZW-e9cBwOM9TwnvJE4rpojRfVA4dVR2Be0aR5eoHglSj3JdW17Hc00aQfb2FYsxQYehpZuM_6Qku61rskbVe2L8II1ttkQm4HELzWppecR8GpBjA-hJQKVz5zimmBGzn6NXBfeAeSPzX-8Lbcf3buw",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAEDWtLM3mvl5vHflfubQUtuEmhQagLDzvbiU27T0Mx3h1C_Ttwer4tdlo5bZsf_IjZOFgA5T-QubRq4MV7HgawUMP1Lbw-SBSZmXZ80eWIq7BU8A8p6XJ_jvO-0KvsMrRQKUIBzx5r9IX979xUFgmU5zSXjgl_eCh2U1J0JWdEsrFaTRcmUtQ9ko_hYXPiAol0ZpjmGQZw_1WjoYl_vLl8nfD05NkvgTEY3HfDll4Z0QuBQaObP5PPD-3acOKLkt1IPubLTzgM9A",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAbLdVV6bWNWXLZh4Cd8ooPRrVXyZQv1VLSGEm0AoDbqB_qUcs1Eb30IVzGTggfF2WG1j6rfX0CvFA2fUsYmO6Ts6r76Qu51b5ZAw3TX4sosw2XoCiRH3czUPChhX6sqfpaIhm20EI2ikZmtYC6KkijjUCryrYidaxugc21bsm6tZmq69_7ODLmlP9-JBd9inr0Gde5wcooKHxihTAr1mR0DQY6SqWBnD-wO_EdnV5s3bIm_S4IpaSTE9xNP3oo_6stTj-BV7CuTQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCBIv5Tej-2z4yXDZoIa4crEkvTH83lUcxTOd0nDODpi0JMaeftLJAfOzp4PF6x1ZuBy_ssQ5P0cNms2KOIByjBpeerDvXKLeB-QOdhayWQGlZ14bSWvGvzvlP-2dwG6QBaxx1P07K5Xj4mK9UsEMXUTP7gcbIhgbtJuBHs3y6LxzpsSussBNXC9_iXemVtTH4gSrdC_C-ThB-Agy6-dZDQ3amAdxNNNiL7OFgBXq2Z4-mJTsGugYBX-7ZZHsbtL-xqyMXbo4GvaQ"
    ],
    category: "Electronics",
    tags: ["Bestseller", "Top Pick"],
    colors: [
      { name: "Midnight Black", value: "#1A1A1A" },
      { name: "Lunar White", value: "#E5E7EB" },
      { name: "Navy Blue", value: "#1E3A8A" }
    ],
    specifications: [
      { label: "Driver Size", value: "50mm custom titanium drivers" },
      { label: "Battery Life", value: "Up to 40 hours with ANC off, 30 hours with ANC on" },
      { label: "Bluetooth Version", value: "Bluetooth 5.2" },
      { label: "Codecs Supported", value: "SBC, AAC, aptX Adaptive" },
      { label: "Weight", value: "285g" }
    ]
  },
  {
    id: "aura-smartwatch",
    name: "Aura Smartwatch Series 5",
    description: "Keep track of your active lifestyle with standard-setting biometrics, optical heart sensors, ECG diagnostics, ambient temperature logging, and a stunning 2000-nit micro-OLED display. It includes custom sport modes, native GPS mapping, automatic fall detection, and standard sleep efficiency metrics. Encased in beautiful surgical-grade titanium.",
    price: 199.50,
    rating: 4.5,
    reviewCount: 128,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0odjdUqj8LoNzMxC-xP0Xcy_UrccyCTwbkQJECk3JXoehWJmqnk9oi24Y4oRQAQfwy3Kfd20Xs2_enninEaju9EjjSeVPEfzG2ouYxDE5VEm_7xcicjGh_9Pq-PXkfILd2qyD59_OmhVQkn1qJ2SkS5P0kU9SQAuNqI6OGGO4xGeF_ZGYLcfeD4RXAGUEWP9qwGRN-iFqlYpApxd9LCbV9CfFzjXT50YGSqhtTQ4MAmSPdANr0fT52oDRi_y_inuq5Nuf3q4Cxg",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD0odjdUqj8LoNzMxC-xP0Xcy_UrccyCTwbkQJECk3JXoehWJmqnk9oi24Y4oRQAQfwy3Kfd20Xs2_enninEaju9EjjSeVPEfzG2ouYxDE5VEm_7xcicjGh_9Pq-PXkfILd2qyD59_OmhVQkn1qJ2SkS5P0kU9SQAuNqI6OGGO4xGeF_ZGYLcfeD4RXAGUEWP9qwGRN-iFqlYpApxd9LCbV9CfFzjXT50YGSqhtTQ4MAmSPdANr0fT52oDRi_y_inuq5Nuf3q4Cxg"
    ],
    category: "Electronics",
    tags: ["Trending"],
    colors: [
      { name: "Silver Titanium", value: "#D1D5DB" },
      { name: "Suede Brown", value: "#78350F" }
    ],
    specifications: [
      { label: "Display Size", value: "1.92-inch Always-On Retina micro-OLED" },
      { label: "Materials", value: "Surgical titanium with sapphire front crystal" },
      { label: "Battery Life", value: "Up to 36 hours regular use, 72 hours low power mode" },
      { label: "Sensors", value: "Blood oxygen, ECG, third-gen optical heart sensor, temperature" }
    ]
  },
  {
    id: "artisan-mug-set",
    name: "Artisan Ceramic Mug Set",
    description: "An elegant pair of hand-painted clay coffee and espresso mugs that fit perfectly on any modern workspace. Built by independent clay smiths to keep your espresso at temperature while feeling premium to hold. Made of thick solid stoneware with a gorgeous matte drip glaze finish.",
    price: 34.00,
    originalPrice: 40.00,
    rating: 5.0,
    reviewCount: 42,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPmQXS-1CWszuOQha8kblMcBv3kg3aajsQ4ZB3SYqohiS6G_piV5Pd2SisjxzH-Ipdf-lOJI49OUfGWw6ZwoW6dLM44C3i_2lE6UWS25O5WmCgR5AzWBIUoV3g9a7njyz-xUe64N9VO_GKTAmYIlxj9GxKGlioQq2BVXr5aA7g_MFa_KdEnwvCYiLp4dKgEGRxZje2c8IMLI50GxEMaqCbluG8b8Vp3vy8ZZqGStEU0cQ_HIYd4UV4s8y2LnZlfon0-ee6EL8ZZQ",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAPmQXS-1CWszuOQha8kblMcBv3kg3aajsQ4ZB3SYqohiS6G_piV5Pd2SisjxzH-Ipdf-lOJI49OUfGWw6ZwoW6dLM44C3i_2lE6UWS25O5WmCgR5AzWBIUoV3g9a7njyz-xUe64N9VO_GKTAmYIlxj9GxKGlioQq2BVXr5aA7g_MFa_KdEnwvCYiLp4dKgEGRxZje2c8IMLI50GxEMaqCbluG8b8Vp3vy8ZZqGStEU0cQ_HIYd4UV4s8y2LnZlfon0-ee6EL8ZZQ"
    ],
    category: "Home & Garden",
    tags: ["-15% Sale"],
    specifications: [
      { label: "Quantity", value: "2 Mugs per set" },
      { label: "Capacity", value: "350ml / 12 fl oz" },
      { label: "Material", value: "High-fired lead-free stoneware clay" },
      { label: "Safety", value: "Dishwasher and Microwave safe" }
    ]
  },
  {
    id: "classic-leather-cardholder",
    name: "Classic Leather Cardholder",
    description: "Ditch the bulk and carry the essentials with this premium vegetable-tanned full-grain leather wallet. Hand-stitched seams insure structural rigidity that gains a beautiful organic patina over years of use.",
    price: 45.00,
    rating: 4.0,
    reviewCount: 89,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFNmdwOsLLctkokXEyXfM7yYEVVN1RhOr3RXFKdlM6CI1fyFQMoqZZn-sIQD3UkcAf3Uugdzv924yfa8ud36w4ZGsSEf7bXrDaBIIyPMmLlmo1HD1BKId_88vL_NnskYTu344Qzq12nYJQ9QM8FhX6fxAa5YwjH-l1PdEWmElCdhR5vjCiE68VFt9Ak3OV_fSH8jK28Kno5xVfvB1O8q6Pay_FjgP0WWYLyJvf4b3cZMcyEm4Z9lFuDValLI63dznkqk-xcpxkIA",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDFNmdwOsLLctkokXEyXfM7yYEVVN1RhOr3RXFKdlM6CI1fyFQMoqZZn-sIQD3UkcAf3Uugdzv924yfa8ud36w4ZGsSEf7bXrDaBIIyPMmLlmo1HD1BKId_88vL_NnskYTu344Qzq12nYJQ9QM8FhX6fxAa5YwjH-l1PdEWmElCdhR5vjCiE68VFt9Ak3OV_fSH8jK28Kno5xVfvB1O8q6Pay_FjgP0WWYLyJvf4b3cZMcyEm4Z9lFuDValLI63dznkqk-xcpxkIA"
    ],
    category: "Fashion",
    tags: ["Best Gift"],
    specifications: [
      { label: "Card Capacity", value: "Up to 6 cards + folded cash pocket" },
      { label: "Material", value: "Vegetable-tanned full-grain cowhide leather" },
      { label: "Dimensions", value: "10.2cm x 7.4cm x 0.4cm" },
      { label: "Shielding", value: "Integrated RFID block layer" }
    ]
  },
  {
    id: "voltx-powerbank",
    name: "VoltX 10000mAh Power Bank",
    description: "Power through your business travel with a lightning-fast premium power brick. At just 12mm thickness, it features USB-C dynamic power delivery up to 30W to quickly revive your phone, watch, and headset synchronously.",
    price: 29.99,
    rating: 4.5,
    reviewCount: 215,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVQ9x7fhtEgnevCa2xUe224_jFwlTp-RmHVP0X-k0snhGydDREGJD_ooeeKrViec7UuLg81usuId5AltGgMYeO9yLkcL4Odg06BIhspoNQsAx0Cj85spPtVzHsTTJebIa_p--BMSmYK-AlvvsWvWzHpY52cx2vDwhM279m7V0DPOu1QWuEBWILkTRgjTjeD5a_u9tj5FxOXYHSujbcUVdrsZnt-ci8TfPNo6Pm8aGIaoPFOJ6N8fZqS2UlrPVxvxLJ-58S63S1GA",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCVQ9x7fhtEgnevCa2xUe224_jFwlTp-RmHVP0X-k0snhGydDREGJD_ooeeKrViec7UuLg81usuId5AltGgMYeO9yLkcL4Odg06BIhspoNQsAx0Cj85spPtVzHsTTJebIa_p--BMSmYK-AlvvsWvWzHpY52cx2vDwhM279m7V0DPOu1QWuEBWILkTRgjTjeD5a_u9tj5FxOXYHSujbcUVdrsZnt-ci8TfPNo6Pm8aGIaoPFOJ6N8fZqS2UlrPVxvxLJ-58S63S1GA"
    ],
    category: "Electronics",
    tags: ["Best Seller"],
    specifications: [
      { label: "Capacity", value: "10000mAh Lithium Polymer" },
      { label: "Input Ports", value: "1x USB-C PD (Up to 18W input)" },
      { label: "Output Ports", value: "1x USB-C PD (30W max), 1x USB-A (22.5W max)" },
      { label: "Weight", value: "185g" }
    ]
  },
  {
    id: "nova-pro-5g",
    name: "Nova Pro 5G - 256GB Storage, Midnight Black",
    description: "The peak of dynamic cellular engineering. The Nova Pro 5G features an immersive 120Hz LTPO screen, incredible 108MP zoom-lens array, water resistance, and state-of-the-art secure neural hardware decryption. Its gorgeous frosted back panel gives it a spectacular premium slate aesthetic.",
    price: 899.00,
    rating: 4.8,
    reviewCount: 428,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRbk3aF3HH-DzqoGFi3OTbXlVbju33tCAjUslSgrGrNTEEm6rrLWQIGZulFFMURZkfHZtPv0q90aVOgf3jj2W4WY4XnL1AcayBCeMJm15bncGypMEPOo4D7XIw3dN5crU9cYDWC3l5115Eb6OQCP89bcYtUzZVw-4rYkClwmg0LwTTqFTZF7nD8LZN8Ftbn2_btmA7i_y7AhPIlq5jkqRfrXgqTEheBQk87QQltMWevYhFEJW5brKjuPhwrGfbheCCW0814i1dwQ",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCRbk3aF3HH-DzqoGFi3OTbXlVbju33tCAjUslSgrGrNTEEm6rrLWQIGZulFFMURZkfHZtPv0q90aVOgf3jj2W4WY4XnL1AcayBCeMJm15bncGypMEPOo4D7XIw3dN5crU9cYDWC3l5115Eb6OQCP89bcYtUzZVw-4rYkClwmg0LwTTqFTZF7nD8LZN8Ftbn2_btmA7i_y7AhPIlq5jkqRfrXgqTEheBQk87QQltMWevYhFEJW5brKjuPhwrGfbheCCW0814i1dwQ"
    ],
    category: "Electronics",
    tags: ["Bestseller"],
    colors: [
      { name: "Midnight Black", value: "#1F2937" },
      { name: "Space Grey", value: "#4B5563" }
    ],
    specifications: [
      { label: "Display", value: "6.7-inch AMOLED, 120Hz LTPO display" },
      { label: "Processor", value: "Neuralcore Octa-Chip 4.2GHz" },
      { label: "Storage", value: "256GB NVMe" },
      { label: "Camera Array", value: "108MP Main + 48MP Telephoto + 12MP Wide" }
    ]
  },
  {
    id: "aura-x1-ultra",
    name: "Aura X1 Ultra - 120Hz Display, Pearl White",
    description: "An ultra-premium phone wrapped in elegant iridescent mother-of-pearl ceramic composites. It boasts a beautiful borderless dynamic refresh display, cinematic slow-motion captures, and up to 2 days of battery stamina for global professionals.",
    price: 934.15,
    originalPrice: 1099.00,
    rating: 4.0,
    reviewCount: 156,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjkppq50lS0wStiRXYfA4wRnQmzifR-CaYz0KDyCGKVi6HWsFPPAMr60nb_78epoQqRd3PuyT_y1WWw-ArvvKM0iVuq4_g_JmRXZ8zKymL-UZJxQQtxwrRkJRJuiFeql2XCV3R1x2z39CVWGiYvm1ZNoYxu0csKMdScJpcNpoJ2ad0wrjhaYD8u23uRwbN7bshljKNWDBHMTrzgI6O2RyYYQMYPP6iiec8UvJ3tZqfRX-_eKNtrbCXICPFHS_nlMNRQKK5C8C-9A",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCjkppq50lS0wStiRXYfA4wRnQmzifR-CaYz0KDyCGKVi6HWsFPPAMr60nb_78epoQqRd3PuyT_y1WWw-ArvvKM0iVuq4_g_JmRXZ8zKymL-UZJxQQtxwrRkJRJuiFeql2XCV3R1x2z39CVWGiYvm1ZNoYxu0csKMdScJpcNpoJ2ad0wrjhaYD8u23uRwbN7bshljKNWDBHMTrzgI6O2RyYYQMYPP6iiec8UvJ3tZqfRX-_eKNtrbCXICPFHS_nlMNRQKK5C8C-9A"
    ],
    category: "Electronics",
    tags: ["-15% Sale"],
    colors: [
      { name: "Pearl White", value: "#F3F4F6" },
      { name: "Aurora Rose", value: "#FBCFE8" }
    ],
    specifications: [
      { label: "Display Size", value: "6.8-inch Dynamic curved OLED" },
      { label: "Storage Capacity", value: "512GB UltraFast Flash" },
      { label: "IP Standard", value: "Water and dust IP68 cert" }
    ]
  },
  {
    id: "titan-rugged-4",
    name: "Titan Rugged Series 4 - Water Resistant, Olive Green",
    description: "Built for mountain tops, deserts, rainstorms, and deep valleys. Encased in beautiful textured polycarbonate casing, it guarantees flawless satellite-link SOS, high-stamina temperature tolerances, and water-drop feedback control. Perfect for outdoor adventurers.",
    price: 549.99,
    rating: 5.0,
    reviewCount: 89,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqexh-SHJXXIxX7POZ-EP4_J8qID-AWofrsXqC-5pgAou4GhT86eOqtD1E_KCpbXXa34twYH_N4z5wV5Etdeg4dNBg-j-P0K7C-vEiOMOhLvxCq_NQd6zUGwHjcupAMy6_nTLe7laEZFunAFcAq1ldnXn3esXivOqNCLdVqvFPkVMk-zKhgWYU_RaqkjpwhHUcDWy4zpiD9QY9f_FJMpowM2-BYJBlMNnWCQMrgeja6k1yIY-kLfpOoXid2HeEseVTYz5VI9sDtw",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBqexh-SHJXXIxX7POZ-EP4_J8qID-AWofrsXqC-5pgAou4GhT86eOqtD1E_KCpbXXa34twYH_N4z5wV5Etdeg4dNBg-j-P0K7C-vEiOMOhLvxCq_NQd6zUGwHjcupAMy6_nTLe7laEZFunAFcAq1ldnXn3esXivOqNCLdVqvFPkVMk-zKhgWYU_RaqkjpwhHUcDWy4zpiD9QY9f_FJMpowM2-BYJBlMNnWCQMrgeja6k1yIY-kLfpOoXid2HeEseVTYz5VI9sDtw"
    ],
    category: "Electronics",
    tags: ["IP69 Waterproof"],
    colors: [
      { name: "Olive Green", value: "#3F4E4F" },
      { name: "Tactical Charcoal", value: "#1A202C" }
    ],
    specifications: [
      { label: "IP Rating", value: "IP69K High-pressure stream resistant" },
      { label: "GPS Module", value: "Dual-band multi-constellation satellite GPS" },
      { label: "Battery Unit", value: "7800mAh high endurance battery" }
    ]
  },
  {
    id: "flexfold-z2",
    name: "FlexFold Z2 - Foldable OLED, Silver Frost",
    description: "A spectacular quantum leap in personal hardware. The FlexFold Z2 opens into a gorgeous borderless foldable OLED panel with pristine light distribution and zero crease visible under lighting. A beautiful premium tool for maximum productivity.",
    price: 1499.00,
    rating: 3.5,
    reviewCount: 24,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuJoqgPdi_9v4p2Nyc8eZibf9FbMGz2oN2HtIoTh1YRNg6-_VtFyCzZhbSgesZrTvOLwVRckRGoRj_eoXLlSbWOtDjy1fWoQNmwZl4LH_LTPQbNZUG7Se319UeL7FEU3Zw8WVbae0N9TTvOKcpCPQ-ZKMj4vfijD72zMFeaLhQ80xTYXpiVnqE3C-6GOE719mOyq-pgi6pgdlYMQVkBYxUw_BLxuNEtlaxrlFYDPWj15Rp4ly_6OL0VC3sgEPNqpTheQyksv0jAWw",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuJoqgPdi_9v4p2Nyc8eZibf9FbMGz2oN2HtIoTh1YRNg6-_VtFyCzZhbSgesZrTvOLwVRckRGoRj_eoXLlSbWOtDjy1fWoQNmwZl4LH_LTPQbNZUG7Se319UeL7FEU3Zw8WVbae0N9TTvOKcpCPQ-ZKMj4vfijD72zMFeaLhQ80xTYXpiVnqE3C-6GOE719mOyq-pgi6pgdlYMQVkBYxUw_BLxuNEtlaxrlFYDPWj15Rp4ly_6OL0VC3sgEPNqpTheQyksv0jAWw"
    ],
    category: "Electronics",
    tags: ["New Arrival"],
    colors: [
      { name: "Silver Frost", value: "#E5E7EB" },
      { name: "Interstellar Navy", value: "#1E3A8A" }
    ],
    specifications: [
      { label: "Folded Display", value: "6.2-inch Outer Slim AMOLED" },
      { label: "Unfolded Display", value: "7.9-inch Foldable Dynamic OLED" },
      { label: "Hinge Model", value: "Dual-axis premium liquid metal" }
    ]
  },
  {
    id: "usb-c-cable",
    name: "Premium Braided USB-C Cable (2m)",
    description: "High-integrity, military-braided nylon charging and high-speed data transmission cable. Fully supports Power Delivery (PD 3.0) up to 100W with smart LED chip indicating current output.",
    price: 19.99,
    originalPrice: 24.99,
    rating: 4.5,
    reviewCount: 89,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAx0083QWL39MvHrh13YpWNoOEsa8SCiq1NC4bucjNlIrj19Teo-8AlRCLSWDa4bxyND6aY0r5_PjD0iy_8GSivZbW5-4q6fB6jU4rllpFKzAOqS_IX2CfWS1QWD21FQo1tjmNrbBHpyuR-btXq0ov3Dq9ZLtipwQKxLOFYk0epfAOk0WKBH3Mg6K_w7-K2wfbG-htFiEt0bCFUo199fbk4vDOSZd_Hp416U0VHXJhRQD3LTyn7M8wQT7GJrmuVRMheh3NKkJxxyA",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAx0083QWL39MvHrh13YpWNoOEsa8SCiq1NC4bucjNlIrj19Teo-8AlRCLSWDa4bxyND6aY0r5_PjD0iy_8GSivZbW5-4q6fB6jU4rllpFKzAOqS_IX2CfWS1QWD21FQo1tjmNrbBHpyuR-btXq0ov3Dq9ZLtipwQKxLOFYk0epfAOk0WKBH3Mg6K_w7-K2wfbG-htFiEt0bCFUo199fbk4vDOSZd_Hp416U0VHXJhRQD3LTyn7M8wQT7GJrmuVRMheh3NKkJxxyA"
    ],
    category: "Electronics",
    tags: ["Sale"],
    specifications: [
      { label: "Connection Speed", value: "Up to 10Gbps USB 3.1 Gen 2" },
      { label: "Length", value: "2 meters / 6.6 feet" },
      { label: "Wattage Supported", value: "Up to 100W PD" }
    ]
  },
  {
    id: "headphone-stand",
    name: "Aluminum Desktop Headphone Stand",
    description: "Elevate your desktop ergonomics with a beautiful unified brushed aluminum headphone arch. It features smooth architectural contours and an anti-slip silicone top rest that distributes headband weight properly to prevent wear.",
    price: 34.99,
    rating: 4.8,
    reviewCount: 215,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtChFtOUM5oH82NeHHmantCytjKu1iMW5kiY3-t8JH80MPNq5CwONGPdEtmWWFDu-b4caeb83HTf7KtWUHy-JgJSm920IUGiW85181KtrIiV3jYYxrFQ9Efx1bhmYsRu2vuN0Q-FGMMXztXgVxx5OekjevSyKteoCtK2HGkfbAyqQYCIg7pB_3jQ7TfdiXsYAAwwNjZFa4aq2FOb7USg8sIZBKLi_kDo1h_XGGXOA_4NshyEsfFKPER4AUIIbMn2JNwOjKHMZoxA",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAtChFtOUM5oH82NeHHmantCytjKu1iMW5kiY3-t8JH80MPNq5CwONGPdEtmWWFDu-b4caeb83HTf7KtWUHy-JgJSm920IUGiW85181KtrIiV3jYYxrFQ9Efx1bhmYsRu2vuN0Q-FGMMXztXgVxx5OekjevSyKteoCtK2HGkfbAyqQYCIg7pB_3jQ7TfdiXsYAAwwNjZFa4aq2FOb7USg8sIZBKLi_kDo1h_XGGXOA_4NshyEsfFKPER4AUIIbMn2JNwOjKHMZoxA"
    ],
    category: "Home & Garden",
    tags: ["Minimalist"],
    specifications: [
      { label: "Material", value: "Premium brushed aluminum alloy & silicone" },
      { label: "Weight", value: "245g balanced steel-weighted base" },
      { label: "Height", value: "28.5cm" }
    ]
  },
  {
    id: "headphones-case",
    name: "X1 Hard Shell Travel Case",
    description: "Safeguard your valuable noise-canceling headphones with this ballistic-density EVA hard-shell storage case. Features a custom plush interior mold, zippered cable compartment, and a modern industrial carry loop to secure to backpack rails.",
    price: 49.00,
    rating: 4.9,
    reviewCount: 420,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzslAdImKabnz_4TdPsIQ24bU4DvXZIBZ6MmLolTLk0QGkRFMxROCNiMy2dYynq4ZJ_aQf8H07xigIzU84_kZBJygu2FnGdtx-HPVnzdP-SGeeYcpWY0Anvkgy8p9woRceyIZx75GHKHwWwyCMUh-iDjH4_orATtz70zE7V6OXkFkUPXTnoi4hz1ETCaxG1Vyt538tEEfPWbFKHiQknssiabwDOTQjFhBm9sz71l6x_g-0vkCkG7Qx1m2yhrJ-7qErv46zHaOqHg",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBzslAdImKabnz_4TdPsIQ24bU4DvXZIBZ6MmLolTLk0QGkRFMxROCNiMy2dYynq4ZJ_aQf8H07xigIzU84_kZBJygu2FnGdtx-HPVnzdP-SGeeYcpWY0Anvkgy8p9woRceyIZx75GHKHwWwyCMUh-iDjH4_orATtz70zE7V6OXkFkUPXTnoi4hz1ETCaxG1Vyt538tEEfPWbFKHiQknssiabwDOTQjFhBm9sz71l6x_g-0vkCkG7Qx1m2yhrJ-7qErv46zHaOqHg"
    ],
    category: "Electronics",
    tags: ["Premium Gear"],
    specifications: [
      { label: "Outer Material", value: "1680D Ballistic grade water-resistant nylon" },
      { label: "Inner Material", value: "Flocked scratch-proof micro-suede lining" },
      { label: "Weight", value: "195g" }
    ]
  },
  {
    id: "stainless-bottle",
    name: "Insulated Stainless Steel Bottle 30oz",
    description: "Stay perfectly hydrated on deep travel paths. This heavy-duty double-wall steel flask is engineered to preserve sub-zero temperatures for up to 36 hours. Its modern brushed metal profile matches clean, modern workspace geometries.",
    price: 35.00,
    rating: 4.7,
    reviewCount: 165,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdLJAI_tCKdSEc66zLwqZv4B22q_wm5KJKM8kqp_HccraNK8YQeHKnDQbd2ODMT3r5Lc2nvt76j9hfSezs-OFhQVAGlRF6ObEyP8blPSkRWY9t4nhrCUVL1QaJ9FiJysPtD2xeWhAKZBTuKcAJoO5Rz1c7PMByJI1_hifbrEczn0ijAHA2cjUbfm5jDEUHwqfW5vqh0Z21rofhX8Off46m7_xif35qQ8fTw8WasBAXCy06ZMb44tL0ZkwCMAgVR_vxNzLTNvYb9g",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCdLJAI_tCKdSEc66zLwqZv4B22q_wm5KJKM8kqp_HccraNK8YQeHKnDQbd2ODMT3r5Lc2nvt76j9hfSezs-OFhQVAGlRF6ObEyP8blPSkRWY9t4nhrCUVL1QaJ9FiJysPtD2xeWhAKZBTuKcAJoO5Rz1c7PMByJI1_hifbrEczn0ijAHA2cjUbfm5jDEUHwqfW5vqh0Z21rofhX8Off46m7_xif35qQ8fTw8WasBAXCy06ZMb44tL0ZkwCMAgVR_vxNzLTNvYb9g"
    ],
    category: "Sports",
    tags: ["High Insulation"],
    specifications: [
      { label: "Material", value: "18/8 food-grade stainless steel, BPA free" },
      { label: "Capacity", value: "30 fl oz / 880ml" },
      { label: "Thermal Retention", value: "Cold for 36 hrs, Hot for 18 hrs" }
    ]
  },
  {
    id: "mechanical-keyboard",
    name: "Ergonomic Mechanical Keyboard - Low Profile",
    description: "An elegant, low-profile keyboard built for maximum tactile efficiency. It features custom lubricated Tactile Brown mechanical switches, double-shot keycaps, standard white ambient LED backlights, and high-frequency Bluetooth link synchronization.",
    price: 129.99,
    rating: 4.8,
    reviewCount: 168,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAq5_qO4zixpeLiftyhBO0SQDwBmvISnpmc0IERTcQRBfAont1iYtDiAhgbMmRXWfskGM2SNxCk_Y5m5ux0mJq-T1s-6KWXx5_8PL5_IZY80HccSui2z_CjIioagUKvwDDIjgUmFtGaNIStmGAWZRJlrGrmdXeZiHwF6OHlCSrcF3-2NMK1a1x6tu3wAb_H2DYxsantMQHvbsn6NW_9-bflAKmwXrtRC3ozQd7yRKkEKVHZC5xq77w2FYr509Op8_rZ21KWQfh5Xg",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAq5_qO4zixpeLiftyhBO0SQDwBmvISnpmc0IERTcQRBfAont1iYtDiAhgbMmRXWfskGM2SNxCk_Y5m5ux0mJq-T1s-6KWXx5_8PL5_IZY80HccSui2z_CjIioagUKvwDDIjgUmFtGaNIStmGAWZRJlrGrmdXeZiHwF6OHlCSrcF3-2NMK1a1x6tu3wAb_H2DYxsantMQHvbsn6NW_9-bflAKmwXrtRC3ozQd7yRKkEKVHZC5xq77w2FYr509Op8_rZ21KWQfh5Xg"
    ],
    category: "Electronics",
    tags: ["Tactile Efficiency"],
    specifications: [
      { label: "Switch Type", value: "Low-profile Mechanical Brown (Tactile)" },
      { label: "Connectivity", value: "Tri-mode: 2.4GHz dongle, Bluetooth 5.1, Wired USB-C" },
      { label: "Layout", value: "75% Minimal compact layout (84 keys)" },
      { label: "Stamina", value: "Up to 150 hours battery life with backlights off" }
    ]
  }
];

export const CATEGORIES_LIST = [
  { id: "all", label: "All Categories", icon: "grid_view" },
  { id: "Electronics", label: "Electronics", icon: "devices" },
  { id: "Fashion", label: "Fashion", icon: "checkroom" },
  { id: "Home & Garden", label: "Home & Garden", icon: "chair" },
  { id: "Sports", label: "Sports", icon: "sports_tennis" },
  { id: "Beauty", label: "Beauty", icon: "brush" },
  { id: "Toys", label: "Toys", icon: "toys" },
  { id: "Groceries", label: "Groceries", icon: "local_cafe" },
  { id: "Trending", label: "Trending", icon: "auto_awesome" }
];
