// Ce fichier simule les données qui viendront de l'API Node/Express + MySQL.
// Il permet de construire le frontend de façon autonome ; il suffira ensuite
// de remplacer les imports de ce fichier par des appels fetch/axios vers l'API.

export const categories = [
  { id: 1, slug: "batiment", nom: "Bâtiment" },
  { id: 2, slug: "services", nom: "Services" },
  { id: 3, slug: "fabrication", nom: "Fabrication" },
  { id: 4, slug: "alimentation", nom: "Alimentation" },
];

export const specialites = [
  { id: 1, nom: "Maçon", categorieId: 1 },
  { id: 2, nom: "Électricien", categorieId: 1 },
  { id: 3, nom: "Plombier", categorieId: 1 },
  { id: 4, nom: "Coiffeur", categorieId: 2 },
  { id: 5, nom: "Cordonnier", categorieId: 2 },
  { id: 6, nom: "Ébéniste", categorieId: 3 },
  { id: 7, nom: "Tapissier", categorieId: 3 },
  { id: 8, nom: "Boulanger", categorieId: 4 },
  { id: 9, nom: "Chocolatier", categorieId: 4 },
];

export const artisans = [
  {
    id: 1,
    nom: "Atelier Dumoulin",
    specialiteId: 6,
    note: 4.5,
    ville: "Lyon",
    image: "/img/artisans/atelier-dumoulin.jpg",
    aPropos:
      "Ébénisterie d'art depuis trois générations, restauration de meubles anciens et créations sur mesure.",
    siteWeb: "https://exemple-atelier-dumoulin.fr",
    artisanDuMois: true,
  },
  {
    id: 2,
    nom: "Claire Bertin — Électricité générale",
    specialiteId: 2,
    note: 5,
    ville: "Clermont-Ferrand",
    image: "/img/artisans/claire-bertin.jpg",
    aPropos:
      "Mise aux normes, dépannage et installation domotique pour particuliers et professionnels.",
    siteWeb: "",
    artisanDuMois: true,
  },
  {
    id: 3,
    nom: "Boulangerie Faure",
    specialiteId: 8,
    note: 4.8,
    ville: "Annecy",
    image: "/img/artisans/boulangerie-faure.jpg",
    aPropos:
      "Pain au levain naturel, viennoiseries maison et farines locales issues de meuniers régionaux.",
    siteWeb: "https://exemple-boulangerie-faure.fr",
    artisanDuMois: true,
  },
  {
    id: 4,
    nom: "Plomberie Roux & Fils",
    specialiteId: 3,
    note: 4.2,
    ville: "Saint-Étienne",
    image: "/img/artisans/plomberie-roux.jpg",
    aPropos: "Dépannage rapide, rénovation de salle de bain, chauffe-eau.",
    siteWeb: "",
    artisanDuMois: false,
  },
  {
    id: 5,
    nom: "Chocolaterie Verlaine",
    specialiteId: 9,
    note: 4.9,
    ville: "Grenoble",
    image: "/img/artisans/chocolaterie-verlaine.jpg",
    aPropos: "Chocolats artisanaux, créations de saison, fèves torréfiées sur place.",
    siteWeb: "https://exemple-chocolaterie-verlaine.fr",
    artisanDuMois: false,
  },
  {
    id: 6,
    nom: "Cordonnerie du Marché",
    specialiteId: 5,
    note: 4.6,
    ville: "Valence",
    image: "/img/artisans/cordonnerie-marche.jpg",
    aPropos: "Réparation de chaussures et maroquinerie, service en 48h.",
    siteWeb: "",
    artisanDuMois: false,
  },
];

export function getCategorieBySlug(slug) {
  return categories.find((c) => c.slug === slug);
}

export function getSpecialite(id) {
  return specialites.find((s) => s.id === id);
}

export function getCategorieOfArtisan(artisan) {
  const specialite = getSpecialite(artisan.specialiteId);
  return categories.find((c) => c.id === specialite?.categorieId);
}
