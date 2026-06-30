export type ThawProfileKey = "fish" | "shrimp" | "meat" | "other";
export type CookingProfileKey =
  | "cold-serve"
  | "steam-fish"
  | "steam-dessert"
  | "reheat-braise"
  | "reheat-soup"
  | "reheat-rice"
  | "reheat-veg";

export type CookingGuideKey = "steam" | "fry" | "air-fryer";

export type ReheatMethod = "GAS_STOVE" | "RICE_COOKER" | "MICROWAVE";

export type DishMetadata = {
  prepSuitabilityScore?: number;
  reheatMethods?: ReheatMethod[];
  primaryIngredient?: string;
  flavorProfile?: string;
  isLeafyGreen?: boolean;
  isFried?: boolean;
  freezeStableLeafyGreen?: boolean;
  requiresCrispyTexture?: boolean;
};

export type CopyTarget =
  | "prompt"
  | "json"
  | "libraryPrompt"
  | "libraryJson"
  | "guestMenu"
  | "thawGuide"
  | "thawReminder"
  | "cookingGuide"
  | "cookingReminder";

export type MenuDish = DishMetadata & {
  id: string;
  role: string;
  dishName: string;
  cuisine: string;
  premadeLevel: string;
  thawProfile: ThawProfileKey;
  cookingProfile: CookingProfileKey;
};

export type RoleDishOption = DishMetadata & {
  libraryId: string;
  role: string;
  dishName: string;
  cuisine: string;
  premadeLevel: string;
  thawProfile: ThawProfileKey;
  cookingProfile: CookingProfileKey;
};

export type RoleDishLibrary = Record<string, RoleDishOption[]>;

export type MenuFilters = {
  cuisine: string;
  premadeLevel: string;
  keyword: string;
};

export type MenuState = {
  dishes: MenuDish[];
  selectedDishId: string | null;
};

export type ThawMethod = {
  title: string;
  score: number;
  method: string;
  reason: string;
};

export type ThawGuide = {
  key: Exclude<ThawProfileKey, "other">;
  label: string;
  shortLabel: string;
  best: ThawMethod;
  secondBest: ThawMethod;
  reminder: string;
};

export type DishThawReminder = {
  dishId: string;
  dishName: string;
  role: string;
  profile: Exclude<ThawProfileKey, "other">;
  profileLabel: string;
  bestTitle: string;
  bestScore: number;
  secondBestTitle: string;
  secondBestScore: number;
  reminder: string;
};

export type CookingGuideEntry = {
  label: string;
  temperature: string;
  duration: string;
  note: string;
  score: number;
};

export type CookingGuide = {
  key: CookingGuideKey;
  label: string;
  summary: string;
  entries: CookingGuideEntry[];
};

export type CookingReminder = {
  dishId: string;
  dishName: string;
  role: string;
  label: string;
  detail: string;
};

export type MenuAction =
  | {
      type: "select";
      payload: string | null;
    }
  | {
      type: "update";
      payload: {
        id: string;
        field: "dishName" | "cuisine" | "premadeLevel";
        value: string;
      };
    }
  | {
      type: "replaceFromLibrary";
      payload: {
        id: string;
        option: RoleDishOption;
      };
    }
  | {
      type: "syncLibraryOption";
      payload: {
        previous: RoleDishOption;
        next: RoleDishOption;
      };
    }
  | {
      type: "reset";
      payload: MenuDish[];
    };
