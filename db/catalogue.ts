// The FreshWave catalogue as supplied by the business.
// Used once to fill an empty database. After that, products are managed in the admin.

export type SeedProduct =
  | string
  | { name: string; trade?: string; optionsLabel?: string; options?: string[]; featured?: boolean };

export type SeedCategory = {
  slug: string;
  name: string;
  description: string;
  division: "detergents" | "chemicals";
  products: SeedProduct[];
};

export const CATALOGUE: SeedCategory[] = [
  {
    slug: "laundry",
    name: "Laundry Products",
    division: "detergents",
    description: "Washing powders, liquid detergents, bleaches, softeners and laundry aids.",
    products: [
      "Washing powder (hand wash)",
      "Washing powder (machine wash)",
      { name: "Liquid laundry detergent", featured: true },
      "Heavy-duty liquid detergent",
      "Laundry bar soap (long bar)",
      { name: "Fabric softener / conditioner", featured: true },
      "Regular chlorine bleach",
      "Thick bleach",
      "Colour-safe / oxygen bleach",
      "Stain remover (for clothes)",
      "Optical whitener (blue)",
      "Laundry starch",
      "Dry-cleaning solvent",
    ],
  },
  {
    slug: "kitchen",
    name: "Kitchen Cleaning",
    division: "detergents",
    description: "Dishwashing liquids, pastes and powders, degreasers and oven cleaners.",
    products: [
      { name: "Dishwashing liquid", featured: true },
      "Dishwashing paste",
      "Dishwashing powder",
      "Kitchen degreaser",
      "Oven and grill cleaner",
    ],
  },
  {
    slug: "toilet-bathroom",
    name: "Toilet & Bathroom",
    division: "detergents",
    description: "Toilet cleaners, tile and grout cleaners, stain removers and drain openers.",
    products: [
      { name: "Toilet cleaner (Harpic type)", featured: true },
      "Toilet blocks / flush cleaner",
      "Tile and grout cleaner",
      "Ceramic stain remover",
      "Drain cleaner / drain opener",
    ],
  },
  {
    slug: "floors-surfaces",
    name: "Floors & Surfaces",
    division: "detergents",
    description: "Multipurpose soaps, floor cleaners, disinfectants, polishes and air fresheners.",
    products: [
      { name: "Multipurpose liquid soap / detergent", featured: true },
      "Floor cleaner",
      { name: "Pine disinfectant", featured: true },
      "Ready-to-use disinfectant",
      "Antiseptic liquid",
      "Glass and window cleaner",
      "Floor polish",
      "Furniture polish",
      "Carpet shampoo",
      "Air freshener",
    ],
  },
  {
    slug: "personal-care",
    name: "Personal Care",
    division: "detergents",
    description: "Hand wash, sanitiser, shower gel, shampoo and soap bars.",
    products: [
      { name: "Liquid hand wash", featured: true },
      { name: "Hand sanitiser (gel and liquid)", optionsLabel: "Type", options: ["Gel", "Liquid"] },
      "Shower gel / body wash",
      "Shampoo",
      "Bathing / toilet soap bars",
      "Glycerine soap",
    ],
  },
  {
    slug: "car-care",
    name: "Car Care",
    division: "detergents",
    description: "Car wash shampoo, tyre shine, dashboard polish and degreasers.",
    products: [
      { name: "Car wash shampoo", featured: true },
      "Tyre shine",
      "Dashboard polish",
      "Engine degreaser",
      "Windscreen washer liquid",
    ],
  },
  {
    slug: "industrial-institutional",
    name: "Industrial & Institutional",
    division: "detergents",
    description: "Cleaning products for hotels, hospitals, kitchens and laundromats.",
    products: [
      "Industrial heavy-duty degreaser",
      "Hospital disinfectant",
      "Food-area sanitiser",
      "Laundry chemicals for hotels and laundromats",
    ],
  },
  {
    slug: "surfactants",
    name: "Surfactants",
    division: "chemicals",
    description: "Active cleaning ingredients for detergent and soap production.",
    products: [
      { name: "Sulphonic acid / LABSA (Ufacid)", trade: "Ufacid" },
      { name: "SLES / Texapon (Ungarol)", trade: "Texapon, Ungarol" },
      {
        name: "SLS (sodium lauryl sulphate) powder and needles",
        optionsLabel: "Form",
        options: ["Powder", "Needles"],
      },
      "Nonylphenol / NP9",
      "CDE / Cocamide DEA",
      "Cocamidopropyl betaine",
      "AOS (alpha olefin sulphonate)",
    ],
  },
  {
    slug: "alkalis",
    name: "Alkalis",
    division: "chemicals",
    description: "Caustic soda, caustic potash, soda ash and related alkalis.",
    products: [
      "Caustic soda flakes (sodium hydroxide)",
      "Caustic soda pearls",
      "Caustic potash (potassium hydroxide)",
      "Soda ash light",
      "Soda ash dense",
      "Sodium bicarbonate (baking soda)",
      "Sodium silicate (water glass)",
    ],
  },
  {
    slug: "builders-water-softeners",
    name: "Builders and Water Softeners",
    division: "chemicals",
    description: "Builders, fillers and water-softening materials.",
    products: [
      "STPP (sodium tripolyphosphate)",
      "Sodium sulphate (powder filler)",
      "Sodium gluconate",
      "EDTA",
      "Industrial salt / stone salt",
    ],
  },
  {
    slug: "acids",
    name: "Acids",
    division: "chemicals",
    description: "Mineral and organic acids for cleaning formulations and industrial use.",
    products: [
      "Hydrochloric acid (HCL)",
      "Phosphoric acid",
      "Citric acid",
      "Oxalic acid",
      "Boric acid",
      "Sulphuric acid",
      "Acetic acid",
    ],
  },
  {
    slug: "bleaching-disinfecting-agents",
    name: "Bleaching and Disinfecting Agents",
    division: "chemicals",
    description: "Chlorine, peroxide and disinfectant raw materials.",
    products: [
      "Sodium hypochlorite (liquid chlorine)",
      "Calcium hypochlorite / HTH (chlorine granules)",
      "Hydrogen peroxide",
      "Sodium percarbonate",
      "Benzalkonium chloride (BKC)",
      "Pine oil",
      "Sodium hydrosulphite (hydros)",
      "Chloroxylenol (PCMX)",
    ],
  },
  {
    slug: "thickeners",
    name: "Thickeners",
    division: "chemicals",
    description: "Materials used to thicken liquid soaps and detergents.",
    products: [
      "CMC (carboxymethyl cellulose)",
      "HEC (hydroxyethyl cellulose)",
      "Industrial salt",
      "Corn starch",
    ],
  },
  {
    slug: "fabric-softener-materials",
    name: "Fabric Softener Materials",
    division: "chemicals",
    description: "Softener bases for fabric conditioner production.",
    products: [
      { name: "Softener granules / flakes (Magic Soft)", trade: "Magic Soft" },
      "Softener paste",
      "Esterquat",
    ],
  },
  {
    slug: "preservatives",
    name: "Preservatives",
    division: "chemicals",
    description: "Preservatives for liquid cleaning and personal care products.",
    products: [
      "Formalin 40% (formaldehyde)",
      "Kathon / CMIT-MIT",
      "Sodium benzoate",
      "Alka preservative",
    ],
  },
  {
    slug: "finishing-additives",
    name: "Finishing Additives",
    division: "chemicals",
    description: "Glycerine, pearlizers, fragrances, dyes and other finishing materials.",
    products: [
      "Glycerine",
      "Pearlizer (glycol distearate)",
      "Opacifier",
      "Optical brightener",
      {
        name: "Perfumes / fragrance oils",
        optionsLabel: "Fragrance",
        options: [
          "Lemon",
          "Lavender",
          "Pine",
          "Rose",
          "Strawberry",
          "Apple",
          "Ocean breeze",
          "Potpourri",
          "Jasmine",
        ],
      },
      {
        name: "Water-soluble dyes",
        optionsLabel: "Colour",
        options: ["Green", "Blue", "Red", "Yellow", "Pink", "Purple"],
      },
    ],
  },
  {
    slug: "solvents",
    name: "Solvents",
    division: "chemicals",
    description: "Alcohols, spirits and other solvents.",
    products: [
      "Methylated spirit",
      "Isopropyl alcohol (IPA)",
      "Ethanol",
      "Acetone",
      "Kerosene / paraffin",
      "Mineral oil / liquid paraffin",
    ],
  },
  {
    slug: "soap-making-oils-bases",
    name: "Soap-Making Oils and Bases",
    division: "chemicals",
    description: "Oils, waxes and bases for soap and cosmetic making.",
    products: [
      "Palm oil",
      "Coconut oil",
      "Castor oil",
      "Stearic acid",
      "Glycerine soap base (melt and pour)",
      "Petroleum jelly",
      "Emulsifying wax",
      "Cetyl alcohol",
    ],
  },
];

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/%/g, " percent ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function defaultDescription(name: string, category: SeedCategory): string {
  if (category.division === "detergents") {
    return `${name}, part of the FreshWave ${category.name.toLowerCase()} range. Contact us for available sizes and current pricing.`;
  }
  return `${name} is supplied as a raw material in our ${category.name.toLowerCase()} range. Request a quotation for packaging sizes and availability.`;
}
