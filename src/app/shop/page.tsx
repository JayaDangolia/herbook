"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  Star,
  ShieldCheck,
  Check,
  CreditCard,
  Truck,
  Sparkles,
} from "lucide-react";
import { initialProducts, Product } from "@/data/shopProducts";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/lib/utils";

export default function ShopPage() {
  const { showNotification } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const categories = ["All", "Period Care", "Pain Relief", "Hormone Wellness"];

  const filteredProducts =
    selectedCategory === "All"
      ? initialProducts
      : initialProducts.filter((p) => p.category === selectedCategory);

  const handleBuy = (product: Product) => {
    showNotification(`Added '${product.name}' to cart! Order simulation active.`);
    setActiveProduct(null);
  };

  return (
    <div className="max-w-md sm:max-w-lg md:max-w-xl mx-auto px-3 sm:px-4 py-4 space-y-6 pb-24 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-plum dark:text-brand-rose">
              Curated Wellness Shop
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-rose" />
            <span className="text-xs text-zinc-500 font-medium">Safe &amp; Biocompatible Essentials</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-display mt-0.5">
            Period Care &amp; Pain Relief Marketplace
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl">
            Toxin-free, gynecologist-approved menstrual cups, heating belts, spearmint teas, and organic bamboo pads.
          </p>
        </div>
      </div>

      {/* Affiliate & Quality Disclosure */}
      <div className="p-4 rounded-3xl bg-brand-blush/60 dark:bg-zinc-900 border border-brand-rose/20 text-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-brand-plum dark:text-brand-rose shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-zinc-900 dark:text-white block mb-0.5">
            Curated Quality Standards &amp; Affiliate Disclosure:
          </strong>
          <span className="text-zinc-600 dark:text-zinc-400 text-[11px]">
            HerBook features verified women-founded brands and biocompatible personal hygiene essentials. Purchases in this demo are processed in sandbox testing mode.
          </span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? "bg-brand-plum text-white border-brand-plum shadow-soft"
                : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-brand-rose"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            onClick={() => setActiveProduct(prod)}
            className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-card hover:shadow-soft transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="aspect-[4/3] overflow-hidden relative bg-zinc-100 dark:bg-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {prod.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-plum text-white shadow-xs">
                    {prod.badge}
                  </span>
                )}
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span className="text-brand-plum dark:text-brand-rose font-semibold">
                    {prod.category}
                  </span>
                  <span className="flex items-center text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 mr-1" />
                    {prod.rating} ({prod.reviewsCount})
                  </span>
                </div>

                <h3 className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-2 leading-snug">
                  {prod.name}
                </h3>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                  {prod.description}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs mt-3">
              <div>
                <div className="text-base font-extrabold text-zinc-900 dark:text-white">
                  {formatINR(prod.price)}
                </div>
                <div className="text-[10px] text-zinc-400 line-through">
                  {formatINR(prod.originalPrice)}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleBuy(prod);
                }}
                className="px-4 py-2 rounded-xl bg-brand-rose hover:bg-brand-rose-dark text-white font-bold text-xs shadow-soft transition-all"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      {activeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => setActiveProduct(null)}
              className="absolute top-5 right-5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold text-xs"
            >
              Close
            </button>

            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeProduct.image}
                alt={activeProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-brand-rose uppercase">
                {activeProduct.category}
              </span>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                {activeProduct.name}
              </h2>
              <div className="text-xl font-extrabold text-zinc-900 dark:text-white pt-1">
                {formatINR(activeProduct.price)}{" "}
                <span className="text-xs font-normal text-zinc-400 line-through">
                  {formatINR(activeProduct.originalPrice)}
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {activeProduct.description}
            </p>

            <div className="space-y-1.5 p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700 text-xs">
              <span className="font-bold text-zinc-800 dark:text-zinc-200 block mb-1">
                Key Product Highlights:
              </span>
              {activeProduct.features.map((f, i) => (
                <div key={i} className="flex items-center space-x-2 text-zinc-600 dark:text-zinc-300">
                  <Check className="w-3.5 h-3.5 text-brand-success shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="text-xs text-zinc-500 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> Fast 2-3 Day Pan-India Delivery
              </div>
              <button
                onClick={() => handleBuy(activeProduct)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-rose to-brand-plum text-white font-bold text-xs shadow-soft"
              >
                Confirm Order (Sandbox)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
