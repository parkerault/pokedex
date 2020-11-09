import * as D from "io-ts/Decoder";

export interface Validator<T> extends D.Decoder<unknown, T> {}
export type DecodeError = D.DecodeError;

/*
 * -----------------------------------------------------------------------------
 * UTILITIES
 * -----------------------------------------------------------------------------
 */

export class DecoderError extends Error {
  name = "DecoderError"
  constructor(result: DecodeError) {
    super();
    this.message = D.draw(result);
  }
}

const APIResource = D.type({
  url: D.string,
});

export const NamedAPIResource = D.type({
  name: D.string,
  url: D.string,
});

export interface INamedAPIResource extends D.TypeOf<typeof NamedAPIResource> {}

export const NamedAPIResourceList = D.type({
  count: D.number,
  next: D.nullable(D.string),
  previous: D.nullable(D.string),
  results: D.array(NamedAPIResource),
});

export interface INamedAPIResourceList extends D.TypeOf<typeof NamedAPIResourceList> {};

const Name = D.type({
  name: D.string,
  language: NamedAPIResource,
});

const Language = D.type({
  id: D.number,
  name: D.string,
  official: D.boolean,
  iso639: D.string,
  iso3166: D.string,
  names: D.array(Name),
});

const Description = D.type({
  description: D.string,
  language: NamedAPIResource,
});

const Effect = D.type({
  effect: D.string,
  language: NamedAPIResource,
});

const Encounter = D.type({
  min_level: D.number,
  max_level: D.number,
  condition_values: D.array(NamedAPIResource),
  chance: D.number,
  method: NamedAPIResource,
});

const FlavorText = D.type({
  flavor_text: D.string,
  language: NamedAPIResource,
  // This may also have a `version` property for the game version.
});

const GenerationGameIndex = D.type({
  game_index: D.number,
  generation: NamedAPIResource,
});

const MachineVersionDetail = D.type({
  machine: APIResource,
  version_group: NamedAPIResource,
});

const VerboseEffect = D.type({
  effect: D.string,
  short_effect: D.string,
  language: NamedAPIResource,
});

const VersionEncounterDetail = D.type({
  version: NamedAPIResource,
  max_chance: D.number,
  encounter_details: D.array(Encounter),
});

const VersionGameIndex = D.type({
  game_index: D.number,
  version: NamedAPIResource,
});

const VersionGroupFlavorText = D.type({
  text: D.string,
  language: NamedAPIResource,
  version_group: NamedAPIResource,
});

// /*
//  * -----------------------------------------------------------------------------
//  * BERRIES
//  * -----------------------------------------------------------------------------
//  */

// /**
//  * Many-to-many relationship with berry -> flavor
//  */
// const BerryFlavorMap = t.type({
//   potency: t.number,
//   flavor: NamedAPIResource,
// });

// /**
//  * Many-to-many relationship with flavor -> berry
//  */
// const FlavorBerryMap = t.type({
//   potency: t.number,
//   berry: NamedAPIResource,
// });

// const BerryName = t.type({
//   name: t.string,
//   color: t.string,
//   language: NamedAPIResource,
// });

// const BerryEffect = t.type({
//   effect: t.string,
//   language: NamedAPIResource,
// });

// /**
//  * Berries are small fruits that can provide HP and status condition
//  * restoration, stat enhancement, and even damage negation when eaten by
//  * Pokémon. Check out Bulbapedia for greater detail.
//  *
//  * GET https://pokeapi.co/api/v2/berry/{id or name}/
//  */

// export const Berry = t.type({
//   id: t.number,
//   name: t.string,
//   growth_time: t.number,
//   max_harvest: t.number,
//   natural_gift_power: t.number,
//   size: t.number,
//   smoothness: t.number,
//   soil_dryness: t.number,
//   firmness: NamedAPIResource,
//   flavors: t.array(BerryFlavorMap),
//   item: NamedAPIResource,
//   natural_gift_type: NamedAPIResource,
// });

// export interface IBerry extends t.TypeOf<typeof Berry> {}
// export type IBerryDecoder = typeof Berry;

// /**
//  * Berries can be soft or hard. Check out Bulbapedia for greater detail.
//  *
//  * GET https://pokeapi.co/api/v2/berry-firmness/{id or name}/
//  */

// export const BerryFirmness = t.type({
//   id: t.number,
//   name: t.string,
//   berries: t.array(NamedAPIResource),
//   names: t.array(Name),
// });

// export interface IBerryFirmness extends t.TypeOf<typeof BerryFirmness> {}
// export type IBerryFirmnessDecoder = typeof BerryFirmness;

// /**
//  * Berry Flavors determine whether a Pokémon will benefit or suffer from eating
//  * a berry based on their nature. Check out Bulbapedia for greater detail.
//  *
//  * GET https://pokeapi.co/api/v2/berry-flavor/{id or name}/
//  */

// export const BerryFlavor = t.type({
//   id: t.number,
//   name: t.string,
//   berries: t.array(FlavorBerryMap),
//   contest_type: NamedAPIResource,
//   names: t.array(Name),
// });

// export interface IBerryFlavor extends t.TypeOf<typeof BerryFlavor> {}
// export type IBerryFlavorDecoder = typeof BerryFlavor;

// /**
//  * Berry Contest types are categories judges used to weigh a Pokémon's
//  * condition in Pokémon contests. Check out Bulbapedia for greater detail.
//  *
//  * GET https://pokeapi.co/api/v2/contest-type/{id or name}/
//  */

// export const ContestType = t.type({
//   id: t.number,
//   name: t.string,
//   berry_flavor: NamedAPIResource,
//   names: t.array(BerryName),
// });

// export interface IContestType extends t.TypeOf<typeof ContestType> {}
// export type IContestTypeDecoder = typeof ContestType;

// export const ContestName = t.type({
//   name: t.string,
//   color: t.string,
//   language: NamedAPIResource,
// });

// /**
//  * Berry Contest effects refer to the effects of moves when used in contests.
//  *
//  * GET https://pokeapi.co/api/v2/contest-effect/{id}/
//  */

// export const ContestEffect = t.type({
//   id: t.number,
//   appeal: t.number,
//   jam: t.number,
//   effect_entries: t.array(BerryEffect),
//   flavor_text_entries: t.array(FlavorText),
// });

// export interface IContestEffect extends t.TypeOf<typeof ContestEffect> {}
// export type IContestEffectDecoder = typeof ContestEffect;

// /**
//  * Berry Super contest effects refer to the effects of moves when used in super
//  * contests.
//  *
//  * GET https://pokeapi.co/api/v2/super-contest-effect/{id}/
//  */

// export const BerrySuperContestEffect = t.type({
//   id: t.number,
//   appeal: t.number,
//   flavor_text_entries: t.array(FlavorText),
//   moves: t.array(NamedAPIResource),
// });

// export interface IBerrySuperContestEffect
//   extends t.TypeOf<typeof BerrySuperContestEffect> {}
// export type IBerrySuperContestDecoder = typeof BerrySuperContestEffect;

// /*
//  * -----------------------------------------------------------------------------
//  * ENCOUNTERS
//  * -----------------------------------------------------------------------------
//  */

// /**
//  * Encounter Methods by which the player might can encounter Pokémon in the
//  * wild, e.g., walking in tall grass. Check out Bulbapedia for greater detail.
//  *
//  * GET https://pokeapi.co/api/v2/encounter-method/{id or name}/
//  */

// export const EncounterMethod = t.type({
//   id: t.number,
//   order: t.number, // A good value for sorting.
//   name: t.string,
//   names: t.array(Name), // The name of this resource listed in different languages.
// });

// export interface IEncounterMethod extends t.TypeOf<typeof EncounterMethod> {}
// export type IEncounterMethodDecoder = typeof EncounterMethod;

// /**
//  * Encounter Conditions which affect what pokemon might appear in the wild,
//  * e.g., day or night.
//  *
//  * GET https://pokeapi.co/api/v2/encounter-condition/{id or name}/
//  */

// export const EncounterCondition = t.type({
//   id: t.number,
//   name: t.string,
//   names: t.array(Name), // The name of this resource listed in different languages.
//   values: t.array(NamedAPIResource),
// });

// export interface IEncounterCondition
//   extends t.TypeOf<typeof EncounterCondition> {}
// export type IEncounterConditionDecoder = typeof EncounterCondition;

// /**
//  * Encounter condition values are the various states that an encounter
//  * condition can have, i.e., time of day can be either day or night.
//  *
//  * GET https://pokeapi.co/api/v2/encounter-condition-value/{id or name}/
//  */

// export const EncounterConditionValue = t.type({
//   id: t.number,
//   name: t.string,
//   names: t.array(Name), // The name of this resource listed in different languages.
//   condition: NamedAPIResource,
// });

// export interface IEncounterConditionValue
//   extends t.TypeOf<typeof EncounterConditionValue> {}
// export type IEncounterConditionValueDecoder = typeof EncounterConditionValue;

/*
 * -----------------------------------------------------------------------------
 * EVOLUTION
 * -----------------------------------------------------------------------------
 */

/**
 * Holy crap, don't try to use t.number or any other branded value in a recurive
 * type class; use t.number instead. I spent like 2 hours trying to debug this.
 */
// export const EvolutionDetail = t.type({
//   item: t.union([NamedAPIResource, t.null]),
//   trigger: t.union([NamedAPIResource, t.null]),
//   gender: t.union([t.number, t.null]),
//   held_item: t.union([NamedAPIResource, t.null]),
//   known_move: t.union([NamedAPIResource, t.null]),
//   known_move_type: t.union([NamedAPIResource, t.null]),
//   location: t.union([NamedAPIResource, t.null]),
//   min_level: t.union([t.number, t.null]),
//   min_happiness: t.union([t.number, t.null]),
//   min_beauty: t.union([t.number, t.null]),
//   min_affection: t.union([t.number, t.null]),
//   needs_overworld_rain: t.union([t.boolean, t.null]),
//   party_species: t.union([NamedAPIResource, t.null]),
//   party_type: t.union([NamedAPIResource, t.null]),
//   relative_physical_stats: t.union([t.number, t.null]),
//   time_of_day: t.union([t.string, t.null]),
//   trade_species: t.union([NamedAPIResource, t.null]),
//   turn_upside_down: t.union([t.boolean, t.null]),
// });

// interface Chain {
//   is_baby: boolean;
//   species: t.TypeOf<typeof NamedAPIResource>;
//   evolution_details: Array<t.TypeOf<typeof EvolutionDetail>>;
//   evolves_to: Array<Chain>;
// }

const ChainSpecies = D.type({
  species: NamedAPIResource,
});

const Chain = D.type({
  is_baby: D.boolean,
  species: NamedAPIResource,
  // evolution_details: t.array(EvolutionDetail),
  evolves_to: D.array(ChainSpecies),
});

/**
 * Evolution chains are essentially family trees. They start with the lowest
 * stage within a family and detail evolution conditions for each as well as
 * Pokémon they can evolve into up through the hierarchy.
 *
 * GET https://pokeapi.co/api/v2/evolution-chain/{id}/
 */

export const EvolutionChain = D.type({
  id: D.number,
  baby_trigger_item: D.nullable(NamedAPIResource),
  chain: Chain,
});

export interface IEvolutionChain extends D.TypeOf<typeof EvolutionChain> {}
export type IEvolutionChainDecoder = typeof EvolutionChain;

/*
 * -----------------------------------------------------------------------------
 * LOCATIONS
 * -----------------------------------------------------------------------------
 */

// export const EncounterVersionDetails = t.type({
//   rate: t.number,
//   version: NamedAPIResource,
// });

// export const EncounterMethodRate = t.type({
//   encounter_method: NamedAPIResource,
//   version_details: t.array(EncounterVersionDetails),
// });

export const PokemonEncounter = D.type({
  pokemon: NamedAPIResource,
});

/**
 * Locations that can be visited within the games. Locations make up sizable
 * portions of regions, like cities or routes.
 *
 * GET https://pokeapi.co/api/v2/location/{id or name}/
 */

export const Location = D.type({
  id: D.number,
  name: D.string,
  region: NamedAPIResource,
  names: D.array(Name),
  game_indices: D.array(GenerationGameIndex),
  areas: D.array(NamedAPIResource),
});

export interface ILocation extends D.TypeOf<typeof Location> {}
export type ILocationDecoder = typeof Location;

/**
 * Location areas are sections of areas, such as floors in a building or cave.
 * Each area has its own set of possible Pokémon encounters.
 *
 * GET https://pokeapi.co/api/v2/location-area/{id or name}/
 */

export const LocationArea = D.type({
  id: D.number,
  name: D.string,
  game_index: D.number,
  // encounter_method_rates: t.array(EncounterMethodRate),
  location: NamedAPIResource,
  names: D.array(Name),
  pokemon_encounters: D.array(PokemonEncounter),
});

export interface ILocationArea extends D.TypeOf<typeof LocationArea> {}
export type ILocationAreaDecoder = typeof LocationArea;

// export const PalParkEncounterSpecies = t.type({
//   base_score: t.number,
//   rate: t.number,
//   pokemon_species: NamedAPIResource,
// });

// /**
//  * Areas used for grouping Pokémon encounters in Pal Park. They're like
//  * habitats that are specific to Pal Park.
//  *
//  * GET https://pokeapi.co/api/v2/pal-park-area/{id or name}/
//  */
// export const PalParkArea = t.type({
//   id: t.number,
//   name: t.string,
//   names: t.array(Name),
//   pokemon_encounters: t.array(PalParkEncounterSpecies),
// });

// export interface IPalParkArea extends t.TypeOf<typeof PalParkArea> {}
// export type IPalParkAreaDecoder = typeof PalParkArea;

/**
 * A region is an organized area of the Pokémon world. Most often, the main
 * difference between regions is the species of Pokémon that can be encountered
 * within them.
 *
 * GET https://pokeapi.co/api/v2/region/{id or name}/
 */

export const Region = D.type({
  id: D.number,
  locations: D.array(NamedAPIResource),
  name: D.string,
  names: D.array(Name),
  main_generation: NamedAPIResource,
  pokedexes: D.array(NamedAPIResource),
  version_groups: D.array(NamedAPIResource),
});

export interface IRegion extends D.TypeOf<typeof Region> {}
export type IRegionDecoder = typeof Region;

/*
 * -----------------------------------------------------------------------------
 * POKEMON
 * -----------------------------------------------------------------------------
 */

export const AbilityEffectChange = D.type({
  effect_entries: D.array(Effect),
  version_group: NamedAPIResource,
});

export const AbilityFlavorText = D.type({
  flavor_text: D.string,
  language: NamedAPIResource,
  version_group: NamedAPIResource,
});

export const AbilityPokemon = D.type({
  is_hidden: D.boolean,
  slot: D.number,
  pokemon: NamedAPIResource,
});

/**
 * Abilities provide passive effects for Pokémon in battle or in the overworld.
 * Pokémon have multiple possible abilities but can have only one ability at a
 * time. Check out Bulbapedia for greater detail.
 *
 * GET https://pokeapi.co/api/v2/ability/{id or name}/
 */

export const Ability = D.type({
  id: D.number,
  name: D.string,
  is_main_series: D.boolean,
  generation: NamedAPIResource,
  names: D.array(Name),
  effect_entries: D.array(VerboseEffect),
  effect_changes: D.array(AbilityEffectChange),
  flavor_text_entries: D.array(AbilityFlavorText),
  pokemon: D.array(AbilityPokemon),
});

export interface IAbility extends D.TypeOf<typeof Ability> {}
export type IAbilityDecoder = typeof Ability;

/**
 * Characteristics indicate which stat contains a Pokémon's highest IV. A
 * Pokémon's Characteristic is determined by the remainder of its highest IV
 * divided by 5 (gene_modulo). Check out Bulbapedia for greater detail.
 *
 * GET https://pokeapi.co/api/v2/characteristic/{id}/
 */

// export const Characteristic = t.type({
//   id: t.number,
//   gene_modulo: t.number,
//   possible_values: t.array(t.number),
// });

// export interface ICharacteristic extends t.TypeOf<typeof Characteristic> {}
// export type ICharacteristicDecoder = typeof Characteristic;

/**
 * Egg Groups are categories which determine which Pokémon are able to
 * interbreed. Pokémon may belong to either one or two Egg Groups. Check out
 * Bulbapedia for greater detail.
 *
 * GET https://pokeapi.co/api/v2/egg-group/{id or name}/
 */

// export const EggGroup = t.type({
//   id: t.number,
//   name: t.string,
//   names: t.array(Name),
//   pokemon_species: t.array(NamedAPIResource),
// });

// export interface IEggGroup extends t.TypeOf<typeof EggGroup> {}
// export type IEggGroupDecoder = typeof EggGroup;

export const PokemonSpeciesGender = D.type({
  rate: D.number,
  pokemon_species: NamedAPIResource,
});

/**
 * Genders were introduced in Generation II for the purposes of breeding
 * Pokémon but can also result in visual differences or even different
 * evolutionary lines. Check out Bulbapedia for greater detail.
 *
 * GET https://pokeapi.co/api/v2/gender/{id or name}/
 */

export const Gender = D.type({
  id: D.number,
  name: D.string,
  pokemon_species_details: D.array(PokemonSpeciesGender),
  required_for_evolution: D.array(NamedAPIResource),
});

export interface IGender extends D.TypeOf<typeof Gender> {}
export type IGenderDecoder = typeof Gender;

const PokemonAbility = D.type({
  is_hidden: D.boolean,
  slot: D.number,
  ability: NamedAPIResource, // Ability
});

const PokemonType = D.type({
  slot: D.number,
  type: NamedAPIResource, // Type
});

// const PokemonHeldItemVersion = t.type({
//   version: NamedAPIResource, // Version
//   rarity: t.number,
// });

// const PokemonHeldItem = t.type({
//   item: NamedAPIResource, // Item,
//   version_details: t.array(PokemonHeldItemVersion),
// });

const PokemonMoveVersion = D.type({
  move_learn_method: NamedAPIResource, // MoveLearnMethod
  version_group: NamedAPIResource, // VersionGroup
  level_learned_at: D.number,
});

const PokemonMove = D.type({
  move: NamedAPIResource, // Move
  // version_group_details: t.array(PokemonMoveVersion),
});

const PokemonStat = D.type({
  stat: NamedAPIResource, // Stat,
  effort: D.number,
  base_stat: D.number,
});

const PokemonSprites = D.type({
  other: D.type({
    "official-artwork": D.type({
      front_default: D.nullable(D.string),
    }),
  }),
});

/**
 * Pokémon are the creatures that inhabit the world of the Pokémon games. They
 * can be caught using Pokéballs and trained by battling with other Pokémon.
 * Each Pokémon belongs to a specific species but may take on a variant which
 * makes it differ from other Pokémon of the same species, such as base stats,
 * available abilities and typings. See Bulbapedia for greater detail.
 *
 * GET https://pokeapi.co/api/v2/pokemon/{id or name}/
 */

export const Pokemon = D.type({
  id: D.number,
  name: D.string,
  base_experience: D.number,
  height: D.number,
  is_default: D.boolean,
  order: D.number,
  weight: D.number,
  abilities: D.array(PokemonAbility),
  // forms: t.array(NamedAPIResource), // PokemonForm
  game_indices: D.array(VersionGameIndex),
  // held_items: t.array(PokemonHeldItem),
  location_area_encounters: D.string, // URL!
  moves: D.array(PokemonMove),
  species: NamedAPIResource, // PokemonSpecies
  sprites: PokemonSprites,
  // stats: t.array(PokemonStat),
  // types: t.array(PokemonType),
});

export interface IPokemon extends D.TypeOf<typeof Pokemon> {}
export type IPokemonDecoder = typeof Pokemon;

/**
 * Pokémon Location Areas are ares where Pokémon can be found.
 *
 * GET https://pokeapi.co/api/v2/pokemon/{id or name}/encounters
 */
export const PokemonLocationAreas = D.array(
  D.type({
    location_area: NamedAPIResource, // LocationArea
    version_details: D.array(VersionEncounterDetail),
  }),
);

/**
 * The pokeAPI counter-intuitively calls this model LocationAreaEncounter, but
 * the endpoint is named Pokemon Location Areas. This is aliased so internal
 * type definitions can use the same nomenclature as the API docs.
 */
const LocationAreaEncounter = PokemonLocationAreas;

export interface IPokemonLocationAreas
  extends D.TypeOf<typeof PokemonLocationAreas> {}
export type IPokemonLocationAreasDecoder = typeof PokemonLocationAreas;

/**
 * Colors used for sorting Pokémon in a Pokédex. The color listed in the
 * Pokédex is usually the color most apparent or covering each Pokémon's body.
 * No orange category exists; Pokémon that are primarily orange are listed as
 * red or brown.
 *
 * GET https://pokeapi.co/api/v2/pokemon-color/{id or name}/
 */

export const PokemonColor = D.type({
  id: D.number,
  name: D.string,
  names: D.array(Name),
  pokemon_species: D.array(NamedAPIResource), // PokemonSpecies
});

export interface IPokemonColor extends D.TypeOf<typeof PokemonColor> {}
export type IPokemonColorDecoder = typeof PokemonColor;

const PokemonFormSprites = D.type({
  front_default: D.string,
  front_shiny: D.string,
});

/**
 * Some Pokémon may appear in one of multiple, visually different forms. These
 * differences are purely cosmetic. For variations within a Pokémon species,
 * which do differ in more than just visuals, the 'Pokémon' entity is used to
 * represent such a variety.
 *
 * GET https://pokeapi.co/api/v2/pokemon-form/{id or name}/
 */

export const PokemonForm = D.type({
  id: D.number,
  name: D.string,
  order: D.number,
  form_order: D.number,
  is_default: D.boolean,
  is_battle_only: D.boolean,
  is_mega: D.boolean,
  form_name: D.string,
  pokemon: NamedAPIResource, // Pokemon
  sprites: PokemonFormSprites,
  version_group: NamedAPIResource, // VersionGroup
  names: D.array(Name),
  form_names: D.array(Name),
});

export interface IPokemonForm extends D.TypeOf<typeof PokemonForm> {}
export type IPokemonFormDecoder = typeof PokemonForm;

const AwesomeName = D.type({
  awesome_name: D.string,
});

/**
 * Shapes used for sorting Pokémon in a Pokédex.
 *
 * GET https://pokeapi.co/api/v2/pokemon-shape/{id or name}/
 */
// export const PokemonShape = t.type({
//   id: t.number,
//   name: t.string,
//   awesome_names: t.array(AwesomeName),
//   names: t.array(Name),
//   pokemon_species: t.array(NamedAPIResource), // PokemonSpecies
// });

// export interface IPokemonShape extends t.TypeOf<typeof PokemonShape> {}
// export type IPokemonShapeDecoder = typeof PokemonShape;

const Genus = D.type({
  genus: D.string,
  language: NamedAPIResource, // Language
});

const PokemonSpeciesVariety = D.type({
  is_default: D.boolean,
  pokemon: NamedAPIResource, // Pokemon
});

/**
 * A Pokémon Species forms the basis for at least one Pokémon. Attributes of a
 * Pokémon species are shared across all varieties of Pokémon within the
 * species. A good example is Wormadam; Wormadam is the species which can be
 * found in three different varieties, Wormadam-Trash, Wormadam-Sandy and
 * Wormadam-Plant.
 *
 * GET https://pokeapi.co/api/v2/pokemon-species/{id or name}/
 */

export const PokemonSpecies = D.type({
  id: D.number,
  name: D.string,
  gender_rate: D.number,
  capture_rate: D.number,
  base_happiness: D.number,
  is_baby: D.boolean,
  is_legendary: D.boolean,
  is_mythical: D.boolean,
  hatch_counter: D.number,
  has_gender_differences: D.boolean,
  forms_switchable: D.boolean,
  growth_rate: NamedAPIResource, // GrowthRate
  egg_groups: D.array(NamedAPIResource), // EggGroup
  color: NamedAPIResource, // PokemonColor
  shape: NamedAPIResource, // PokemonShape
  evolves_from_species: D.nullable(NamedAPIResource),
  evolution_chain: APIResource, // EvolutionChain
  habitat: NamedAPIResource, // PokemonHabitat
  names: D.array(Name),
  flavor_text_entries: D.array(FlavorText),
  form_descriptions: D.array(Description),
  genera: D.array(Genus),
  varieties: D.array(PokemonSpeciesVariety),
});

export interface IPokemonSpecies extends D.TypeOf<typeof PokemonSpecies> {}
export type IPokemonSpeciesDecoder = typeof PokemonSpecies;

/*
 * -----------------------------------------------------------------------------
 * MOVES
 * -----------------------------------------------------------------------------
 */

const ContestComboDetail = D.type({
  use_before: D.nullable(D.array(NamedAPIResource)),
  use_after: D.nullable(D.array(NamedAPIResource)),
});

const ContestComboSet = D.type({
  normal: ContestComboDetail,
  super: ContestComboDetail,
});

const MoveFlavorText = D.type({
  flavor_text: D.string,
  language: NamedAPIResource,
  version_group: NamedAPIResource,
});

// const MoveMetaData = t.type({
//   ailment: NamedAPIResource,
//   category: NamedAPIResource,
//   min_hits: t.number,
//   max_hits: t.number,
//   min_turns: t.union([t.number, t.null]),
//   max_turns: t.union([t.number, t.null]),
//   drain: t.number,
//   healing: t.number,
//   crit_rate: t.number,
//   ailment_chance: t.number,
//   flinch_chance: t.number,
//   stat_chance: t.number,
// });

const MoveStatChange = D.type({
  change: D.number,
  stat: NamedAPIResource,
});

const PastMoveStatValues = D.type({
  accuracy: D.number,
  effect_chance: D.number,
  power: D.number,
  pp: D.number,
  effect_entries: VerboseEffect,
  version_group: NamedAPIResource,
});

/**
 * Moves are the skills of Pokémon in battle. In battle, a Pokémon uses one
 * move each turn. Some moves (including those learned by Hidden Machine) can
 * be used outside of battle as well, usually for the purpose of removing
 * obstacles or exploring new areas.
 *
 * GET https://pokeapi.co/api/v2/move/{id or name}/
 */
export const Move = D.type({
  id: D.number,
  name: D.string,
  accuracy: D.nullable(D.number),
  effect_chance: D.nullable(D.number),
  pp: D.number,
  priority: D.number,
  power: D.nullable(D.number),
  contest_combos: D.nullable(ContestComboSet),
  contest_type: D.nullable(NamedAPIResource),
  contest_effect: D.nullable(APIResource,),
  damage_class: NamedAPIResource,
  effect_entries: D.array(VerboseEffect),
  effect_changes: D.array(AbilityEffectChange),
  flavor_text_entries: D.array(MoveFlavorText),
  generation: NamedAPIResource,
  machines: D.array(MachineVersionDetail),
  // meta: MoveMetaData,
  names: D.array(Name),
  // past_values: t.array(PastMoveStatValues),
  stat_changes: D.array(MoveStatChange),
  super_contest_effect: D.nullable(APIResource),
  target: NamedAPIResource,
  type: NamedAPIResource,
});

export interface IMove extends D.TypeOf<typeof Move> {}
export type IMoveDecoder = typeof Move;
