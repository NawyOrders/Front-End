import type { IconName } from "@/components/landing/Icon";

export type Card = { icon: IconName; title: string; text: string };

export type Plan = {
  id: string;
  name: string;
  audience: string;
  monthly: number;
  yearly: number;
  features: string[];
  featured?: boolean;
  disabledFeatures?: string[];
};

export type Dictionary = {
  meta: {
    title: string;
    titleTemplate: string;
    description: string;
    ogTitle: string;
  };
  brand: { name: string };
  nav: {
    mainLabel: string;
    mobileLabel: string;
    home: string;
    features: string;
    how: string;
    pricing: string;
    showcase: string;
    faq: string;
    login: string;
    openMenu: string;
    closeMenu: string;
    switchLabel: string;
  };
  hero: { badge: string; titleLead: string; titleAccent: string; body: string; ctaPrimary: string; ctaSecondary: string; visualAlt: string };
  stats: { value: string; label: string }[];
  marquee: { label: string; restaurants: string[] };
  problems: { badge: string; title: string; body: string; items: Card[] };
  solution: {
    badge: string;
    titleLead: string;
    titleAccent: string;
    titleTail: string;
    body: string;
    stepPrefix: string;
    steps: { title: string; text: string }[];
  };
  features: { badge: string; titleLead: string; titleAccent: string; body: string; items: Card[] };
  showcase: { badge: string; titleLead: string; titleAccent: string; body: string; mockupAlt: string };
  pricing: {
    badge: string;
    title: string;
    body: string;
    periodLabel: string;
    monthly: string;
    yearly: string;
    recommended: string;
    perMonth: string;
    perYear: string;
    cta: string;
    scrollHint: string;
    saveNote: string;
    goToPlan: string;
    dotsLabel: string;
    plans: Plan[];
  };
  testimonials: {
    badge: string;
    title: string;
    body: string;
    starsLabel: string;
    items: { name: string; role: string; quote: string; rating: number }[];
  };
  faq: { badge: string; title: string; body: string; items: { q: string; a: string }[] };
  cta: {
    title: string;
    body: string;
    qrAlt: string;
    qrButton: string;
    qrNote: string;
  };
  footer: {
    tagline: string;
    copyright: string;
    columns: { title: string; links: string[] }[];
    social: { linkedin: string; twitter: string; instagram: string; facebook: string };
  };
  mockup: {
    myRestaurant: string;
    welcome: string;
    greeting: string;
    promoLabel: string;
    promoValue: string;
    cta: string;
    search: string;
    filterAll: string;
    filterBurger: string;
    filterPizza: string;
    newDishes: string;
    dishName: string;
    dishDesc: string;
    dishPrice: string;
  };
};
