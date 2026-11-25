export interface Product {
  id: string;
  name: string;
  category: "Period Care" | "Pain Relief" | "Hormone Wellness" | "Hygiene";
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  description: string;
  image: string;
  badge?: string;
  features: string[];
}

export const initialProducts: Product[] = [
  {
    id: "prod-1",
    name: "HerBook Medical-Grade Silicone Menstrual Cup",
    category: "Period Care",
    price: 499,
    originalPrice: 799,
    rating: 4.8,
    reviewsCount: 312,
    badge: "Bestseller",
    description:
      "100% biocompatible, ultra-soft US-FDA compliant medical silicone. Up to 12 hours of leak-free protection and zero rashes.",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80",
    features: [
      "12-hour leak protection",
      "Reusable up to 5 years",
      "Eco-friendly & zero plastic waste",
      "Includes breathable cotton pouch & sterilizer container",
    ],
  },
  {
    id: "prod-2",
    name: "Graphene Fast-Heating & Vibrating Cramp Relief Belt",
    category: "Pain Relief",
    price: 1299,
    originalPrice: 1999,
    rating: 4.9,
    reviewsCount: 245,
    badge: "Staff Pick",
    description:
      "Instant 3-second warming technology with 3 heat levels (45°C/55°C/65°C) and 4 vibration massage frequencies for rapid dysmenorrhea relief.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format&fit=crop&q=80",
    features: [
      "Lightweight, wearable under clothes",
      "Type-C USB rechargeable battery (up to 4 hours)",
      "Auto shut-off safety sensor",
      "Skin-friendly velvet lining",
    ],
  },
  {
    id: "prod-3",
    name: "Spearmint & Shatavari Hormonal Balance Organic Tea",
    category: "Hormone Wellness",
    price: 349,
    originalPrice: 450,
    rating: 4.7,
    reviewsCount: 189,
    badge: "PCOS Friendly",
    description:
      "Clinically blended Himalayan spearmint, wild shatavari, and licorice root formulated to support healthy androgen levels and digestive ease.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80",
    features: [
      "Caffeine-free herbal tisane",
      "Contains pure Mentha spicata for androgen balance",
      "Zero added artificial flavors or sugar",
      "30 pyramid tea bags",
    ],
  },
  {
    id: "prod-4",
    name: "100% Organic Bamboo Biodegradable Day & Night Pads (Pack of 20)",
    category: "Period Care",
    price: 299,
    originalPrice: 380,
    rating: 4.8,
    reviewsCount: 420,
    badge: "Eco Hero",
    description:
      "Chlorine-free, toxin-free certified organic bamboo pulp pads. Hypoallergenic, breathable, and gentle on sensitive vulvar skin.",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80",
    features: [
      "Biodegradable within 6 months",
      "No artificial fragrances or dioxins",
      "Super-absorbent natural plant core",
      "Individual plant-based wrappers",
    ],
  },
  {
    id: "prod-5",
    name: "HerComfort Magnesium & Lavender Period Roll-On (50ml)",
    category: "Pain Relief",
    price: 399,
    originalPrice: 550,
    rating: 4.6,
    reviewsCount: 164,
    description:
      "Transdermal magnesium chloride combined with pure lavender and peppermint essential oils for instant targeted soothing of lower back and abdomen cramps.",
    image: "https://images.unsplash.com/photo-1608248597359-548325f5480c?w=500&auto=format&fit=crop&q=80",
    features: [
      "Non-greasy, fast-absorbing roll-on applicator",
      "High bioavailability topical magnesium",
      "Calming aromatherapy scent",
      "Travel friendly pocket size",
    ],
  },
];
