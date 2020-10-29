import { id } from "fp-ts/lib/Reader";
import * as t from "io-ts";

/*
 * -----------------------------------------------------------------------------
 * UTILITIES
 * -----------------------------------------------------------------------------
 */

const APIResource = t.type({
  url: t.string,
});

const NamedAPIResource = t.type({
  name: t.string,
  url: t.string,
});

const NamedAPIResourceList = t.type({
  count: t.Integer,
  next: t.string,
  previous: t.string,
  results: t.array(NamedAPIResource),
});

const Name = t.type({
  name: t.string,
  language: NamedAPIResource,
});

const Language = t.type({
  id: t.Int,
  name: t.string,
  official: t.boolean,
  iso639: t.string,
  iso3166: t.string,
  names: t.array(Name),
});

const Description = t.type({
  description: t.string,
  language: NamedAPIResource,
});

const Effect = t.type({
  effect: t.string,
  language: NamedAPIResource,
});

const Encounter = t.type({
  min_level: t.Int,
  max_level: t.Int,
  condition_values: t.array(NamedAPIResource),
  chance: t.Int,
  method: NamedAPIResource,
});

const FlavorText = t.type({
  flavor_text: t.string,
  language: NamedAPIResource,
  // This may also have a `version` property for the game version.
});

const GenerationGameIndex = t.type({
  game_index: t.Int,
  generation: NamedAPIResource,
});

const MachineVersionDetail = t.type({
  machine: APIResource,
  version_group: NamedAPIResource,
});

const VerboseEffect = t.type({
  effect: t.string,
  short_effect: t.string,
  language: NamedAPIResource,
});

const VersionEncounterDetail = t.type({
  version: NamedAPIResource,
  max_chance: t.Int,
  encounter_details: t.array(Encounter),
});

const VersionGameIndex = t.type({
  game_index: t.Int,
  version: NamedAPIResource,
});

const VersionGroupFlavorText = t.type({
  text: t.string,
  language: NamedAPIResource,
  version_group: NamedAPIResource,
});

/*
 * -----------------------------------------------------------------------------
 * BERRIES
 * -----------------------------------------------------------------------------
 */

/**
 * Many-to-many relationship with berry -> flavor
 */
const BerryFlavorMap = t.type({
  potency: t.Integer,
  flavor: NamedAPIResource,
});

/**
 * Many-to-many relationship with flavor -> berry
 */
const FlavorBerryMap = t.type({
  potency: t.Int,
  berry: NamedAPIResource,
});

const BerryName = t.type({
  name: t.string,
  color: t.string,
  language: NamedAPIResource,
});

const BerryEffect = t.type({
  effect: t.string,
  language: NamedAPIResource,
});

/**
 * Berries are small fruits that can provide HP and status condition
 * restoration, stat enhancement, and even damage negation when eaten by
 * Pokémon. Check out Bulbapedia for greater detail.
 *
 * GET https://pokeapi.co/api/v2/berry/{id or name}/
 */

export const Berry = t.type({
  id: t.Integer,
  name: t.string,
  growth_time: t.Integer,
  max_harvest: t.Integer,
  natural_gift_power: t.Integer,
  size: t.Integer,
  smoothness: t.Integer,
  soil_dryness: t.Integer,
  firmness: NamedAPIResource,
  flavors: t.array(BerryFlavorMap),
  item: NamedAPIResource,
  natural_gift_type: NamedAPIResource,
});

export interface IBerry extends t.TypeOf<typeof Berry> {}

/**
 * Berries can be soft or hard. Check out Bulbapedia for greater detail.
 *
 * GET https://pokeapi.co/api/v2/berry-firmness/{id or name}/
 */

export const BerryFirmness = t.type({
  id: t.Int,
  name: t.string,
  berries: t.array(NamedAPIResource),
  names: t.array(Name),
});

export interface IBerryFirmness extends t.TypeOf<typeof BerryFirmness> {}

/**
 * Berry Flavors determine whether a Pokémon will benefit or suffer from eating
 * a berry based on their nature. Check out Bulbapedia for greater detail.
 *
 * GET https://pokeapi.co/api/v2/berry-flavor/{id or name}/
 */

export const BerryFlavor = t.type({
  id: t.Int,
  name: t.string,
  berries: t.array(FlavorBerryMap),
  contest_type: NamedAPIResource,
  names: t.array(Name),
});

export interface IBerryFlavor extends t.TypeOf<typeof BerryFlavor> {}

/**
 * Berry Contest types are categories judges used to weigh a Pokémon's
 * condition in Pokémon contests. Check out Bulbapedia for greater detail.
 *
 * GET https://pokeapi.co/api/v2/contest-type/{id or name}/
 */

export const ContestType = t.type({
  id: t.Integer,
  name: t.string,
  berry_flavor: NamedAPIResource,
  names: t.array(BerryName),
});

export interface IContestType extends t.TypeOf<typeof ContestType> {}

export const ContestName = t.type({
  name: t.string,
  color: t.string,
  language: NamedAPIResource,
});

/**
 * Berry Contest effects refer to the effects of moves when used in contests.
 *
 * GET https://pokeapi.co/api/v2/contest-effect/{id}/
 */

export const ContestEffect = t.type({
  id: t.Integer,
  appeal: t.Integer,
  jam: t.Integer,
  effect_entries: t.array(BerryEffect),
  flavor_text_entries: t.array(FlavorText),
});

export interface IContestEffect extends t.TypeOf<typeof ContestEffect> {}

/**
 * Berry Super contest effects refer to the effects of moves when used in super
 * contests.
 *
 * GET https://pokeapi.co/api/v2/super-contest-effect/{id}/
 */

export const BerrySuperContestEffect = t.type({
  id: t.Integer,
  appeal: t.Integer,
  flavor_text_entries: t.array(FlavorText),
  moves: t.array(NamedAPIResource),
});

export interface IBerrySuperContest
  extends t.TypeOf<typeof BerrySuperContestEffect> {}

/*
 * -----------------------------------------------------------------------------
 * ENCOUNTERS
 * -----------------------------------------------------------------------------
 */

/**
 * Encounter Methods by which the player might can encounter Pokémon in the
 * wild, e.g., walking in tall grass. Check out Bulbapedia for greater detail.
 *
 * GET https://pokeapi.co/api/v2/encounter-method/{id or name}/
 */

export const EncounterMethod = t.type({
  id: t.Integer,
  order: t.Integer, // A good value for sorting.
  name: t.string,
  names: t.array(Name), // The name of this resource listed in different languages.
});

export interface IEncounterMethod extends t.TypeOf<typeof EncounterMethod> {}

/**
 * Encounter Conditions which affect what pokemon might appear in the wild,
 * e.g., day or night.
 *
 * GET https://pokeapi.co/api/v2/encounter-condition/{id or name}/
 */

export const EncounterCondition = t.type({
  id: t.Integer,
  name: t.string,
  names: t.array(Name), // The name of this resource listed in different languages.
  values: t.array(NamedAPIResource),
});

export interface IEncounterCondition
  extends t.TypeOf<typeof EncounterCondition> {}

/**
 * Encounter condition values are the various states that an encounter
 * condition can have, i.e., time of day can be either day or night.
 *
 * GET https://pokeapi.co/api/v2/encounter-condition-value/{id or name}/
 */

export const EncounterConditionValue = t.type({
  id: t.Integer,
  name: t.string,
  names: t.array(Name), // The name of this resource listed in different languages.
  condition: NamedAPIResource,
});

export interface IEncounterConditionValue
  extends t.TypeOf<typeof EncounterConditionValue> {}

/*
 * -----------------------------------------------------------------------------
 * EVOLUTION
 * -----------------------------------------------------------------------------
 */

/**
 * Holy crap, don't try to use t.Int or any other branded value in a recurive
 * type class; use t.number instead. I spent like 2 hours trying to debug this.
 */
export const EvolutionDetail = t.type({
  item: t.union([NamedAPIResource, t.null]),
  trigger: t.union([NamedAPIResource, t.null]),
  gender: t.union([t.number, t.null]),
  held_item: t.union([NamedAPIResource, t.null]),
  known_move: t.union([NamedAPIResource, t.null]),
  known_move_type: t.union([NamedAPIResource, t.null]),
  location: t.union([NamedAPIResource, t.null]),
  min_level: t.union([t.number, t.null]),
  min_happiness: t.union([t.number, t.null]),
  min_beauty: t.union([t.number, t.null]),
  min_affection: t.union([t.number, t.null]),
  needs_overworld_rain: t.union([t.boolean, t.null]),
  party_species: t.union([NamedAPIResource, t.null]),
  party_type: t.union([NamedAPIResource, t.null]),
  relative_physical_stats: t.union([t.number, t.null]),
  time_of_day: t.union([t.string, t.null]),
  trade_species: t.union([NamedAPIResource, t.null]),
  turn_upside_down: t.union([t.boolean, t.null]),
});

interface Chain {
  is_baby: boolean;
  species: t.TypeOf<typeof NamedAPIResource>;
  evolution_details: Array<t.TypeOf<typeof EvolutionDetail>>;
  evolves_to: Array<Chain>;
}

const Chain: t.Type<Chain> = t.recursion("Chain", () =>
  t.type({
    is_baby: t.boolean,
    species: NamedAPIResource,
    evolution_details: t.array(EvolutionDetail),
    evolves_to: t.array(Chain),
  }),
);

/**
 * Evolution chains are essentially family trees. They start with the lowest
 * stage within a family and detail evolution conditions for each as well as
 * Pokémon they can evolve into up through the hierarchy.
 *
 * GET https://pokeapi.co/api/v2/evolution-chain/{id}/
 */

export const EvolutionChain = t.type({
  id: t.Int,
  baby_trigger_item: t.union([NamedAPIResource, t.null]),
  chain: Chain,
});

export interface IEvolutionChain extends t.TypeOf<typeof EvolutionChain> {}

/*
 * -----------------------------------------------------------------------------
 * LOCATIONS
 * -----------------------------------------------------------------------------
 */

export const EncounterVersionDetails = t.type({
  rate: t.Int,
  version: NamedAPIResource,
});

export const EncounterMethodRate = t.type({
  encounter_method: NamedAPIResource,
  version_details: t.array(EncounterVersionDetails),
});

export const PokemonEncounter = t.type({
  pokemon: NamedAPIResource,
  version_details: t.array(VersionEncounterDetail),
});

/**
 * Locations that can be visited within the games. Locations make up sizable
 * portions of regions, like cities or routes.
 *
 * GET https://pokeapi.co/api/v2/location/{id or name}/
 */

export const Location = t.type({
  id: t.Int,
  name: t.string,
  region: NamedAPIResource,
  names: t.array(Name),
  game_indices: t.array(GenerationGameIndex),
  areas: t.array(NamedAPIResource),
});

export interface ILocation extends t.TypeOf<typeof Location> {}

/**
 * Location areas are sections of areas, such as floors in a building or cave.
 * Each area has its own set of possible Pokémon encounters.
 *
 * GET https://pokeapi.co/api/v2/location-area/{id or name}/
 */

export const LocationArea = t.type({
  id: t.Int,
  name: t.string,
  game_index: t.Int,
  encounter_method_rates: t.array(EncounterMethodRate),
  location: NamedAPIResource,
  names: t.array(Name),
  pokemon_encounters: t.array(PokemonEncounter),
});

export interface ILocationArea extends t.TypeOf<typeof LocationArea> {}

export const PalParkEncounterSpecies = t.type({
  base_score: t.Int,
  rate: t.Int,
  pokemon_species: NamedAPIResource,
});

/**
 * Areas used for grouping Pokémon encounters in Pal Park. They're like
 * habitats that are specific to Pal Park.
 *
 * GET https://pokeapi.co/api/v2/pal-park-area/{id or name}/
 */
export const PalParkArea = t.type({
  id: t.Int,
  name: t.string,
  names: t.array(Name),
  pokemon_encounters: t.array(PalParkEncounterSpecies),
});

export interface IPalParkArea extends t.TypeOf<typeof PalParkArea> {}

/**
 * A region is an organized area of the Pokémon world. Most often, the main
 * difference between regions is the species of Pokémon that can be encountered
 * within them.
 *
 * GET https://pokeapi.co/api/v2/region/{id or name}/
 */

export const Region = t.type({
  id: t.Int,
  locations: t.array(NamedAPIResource),
  name: t.string,
  names: t.array(Name),
  main_generation: NamedAPIResource,
  pokedexes: t.array(NamedAPIResource),
  version_groups: t.array(NamedAPIResource),
});

export interface IRegion extends t.TypeOf<typeof Region> {}

/*
 * -----------------------------------------------------------------------------
 * POKEMON
 * -----------------------------------------------------------------------------
 */

export const AbilityEffectChange = t.type({
  effect_entries: t.array(Effect),
  version_group: NamedAPIResource,
});

export const AbilityFlavorText = t.type({
  flavor_text: t.string,
  language: NamedAPIResource,
  version_group: NamedAPIResource,
});

export const AbilityPokemon = t.type({
  is_hidden: t.boolean,
  slot: t.Int,
  pokemon: NamedAPIResource,
});

/**
 * Abilities provide passive effects for Pokémon in battle or in the overworld.
 * Pokémon have multiple possible abilities but can have only one ability at a
 * time. Check out Bulbapedia for greater detail.
 *
 * GET https://pokeapi.co/api/v2/ability/{id or name}/
 */

export const Ability = t.type({
  id: t.Int,
  name: t.string,
  is_main_series: t.boolean,
  generation: NamedAPIResource,
  names: t.array(Name),
  effect_entries: t.array(VerboseEffect),
  effect_changes: t.array(AbilityEffectChange),
  flavor_text_entries: t.array(AbilityFlavorText),
  pokemon: t.array(AbilityPokemon),
});

export interface IAbility extends t.TypeOf<typeof Ability> {}

/**
 * Characteristics indicate which stat contains a Pokémon's highest IV. A
 * Pokémon's Characteristic is determined by the remainder of its highest IV
 * divided by 5 (gene_modulo). Check out Bulbapedia for greater detail.
 *
 * GET https://pokeapi.co/api/v2/characteristic/{id}/
 */

export const Characteristic = t.type({
  id: t.Int,
  gene_modulo: t.Int,
  possible_values: t.array(t.Int),
});

export interface ICharacteristic extends t.TypeOf<typeof Characteristic> {}

/**
 * Egg Groups are categories which determine which Pokémon are able to
 * interbreed. Pokémon may belong to either one or two Egg Groups. Check out
 * Bulbapedia for greater detail.
 *
 * GET https://pokeapi.co/api/v2/egg-group/{id or name}/
 */

export const EggGroup = t.type({
  id: t.Int,
  name: t.string,
  names: t.array(Name),
  pokemon_species: t.array(NamedAPIResource),
});

export interface IEggGroup extends t.TypeOf<typeof EggGroup> {}

export const PokemonSpeciesGender = t.type({
  rate: t.Int,
  pokemon_species: NamedAPIResource,
});

/**
 * Genders were introduced in Generation II for the purposes of breeding
 * Pokémon but can also result in visual differences or even different
 * evolutionary lines. Check out Bulbapedia for greater detail.
 *
 * GET https://pokeapi.co/api/v2/gender/{id or name}/
 */

export const Gender = t.type({
  id: t.Int,
  name: t.string,
  pokemon_species_details: t.array(PokemonSpeciesGender),
  required_for_evolution: t.array(NamedAPIResource),
});

export interface IGender extends t.TypeOf<typeof Gender> {}

const PokemonAbility = t.type({
  is_hidden: t.boolean,
  slot: t.Int,
  ability: NamedAPIResource, // Ability
});

const PokemonType = t.type({
  slot: t.Int,
  type: NamedAPIResource, // Type
});

const PokemonHeldItemVersion = t.type({
  version: NamedAPIResource, // Version
  rarity: t.Int,
});

const PokemonHeldItem = t.type({
  item: NamedAPIResource, // Item,
  version_details: t.array(PokemonHeldItemVersion),
});

const PokemonMoveVersion = t.type({
  move_learn_method: NamedAPIResource, // MoveLearnMethod
  version_group: NamedAPIResource, // VersionGroup
  level_learned_at: t.Int,
});

const PokemonMove = t.type({
  move: NamedAPIResource, // Move
  version_group_details: t.array(PokemonMoveVersion),
});

const PokemonStat = t.type({
  stat: NamedAPIResource, // Stat,
  effort: t.Int,
  base_stat: t.Int,
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

export const Pokemon = t.type({
  id: t.Int,
  name: t.string,
  base_experience: t.Int,
  height: t.Int,
  is_default: t.boolean,
  order: t.Int,
  weight: t.Int,
  abilities: t.array(PokemonAbility),
  forms: t.array(NamedAPIResource), // PokemonForm
  game_indices: t.array(VersionGameIndex),
  held_items: t.array(PokemonHeldItem),
  location_area_encounters: t.string,
  moves: t.array(PokemonMove),
  species: NamedAPIResource, // PokemonSpecies
  stats: t.array(PokemonStat),
  types: t.array(PokemonType),
});

export interface IPokemon extends t.TypeOf<typeof Pokemon> {}

/**
 * Pokémon Location Areas are ares where Pokémon can be found.
 *
 * GET https://pokeapi.co/api/v2/pokemon/{id or name}/encounters
 */
export const PokemonLocationAreas = t.array(
  t.type({
    location_area: NamedAPIResource, // LocationArea
    version_details: t.array(VersionEncounterDetail),
  }),
);

/**
 * The pokeAPI counter-intuitively calls this model LocationAreaEncounter, but
 * the endpoint is named Pokemon Location Areas. This is aliased so internal
 * type definitions can use the same nomenclature as the API docs.
 */
const LocationAreaEncounter = PokemonLocationAreas;

export interface IPokemonLocationAreas
  extends t.TypeOf<typeof PokemonLocationAreas> {}

/**
 * Colors used for sorting Pokémon in a Pokédex. The color listed in the
 * Pokédex is usually the color most apparent or covering each Pokémon's body.
 * No orange category exists; Pokémon that are primarily orange are listed as
 * red or brown.
 *
 * GET https://pokeapi.co/api/v2/pokemon-color/{id or name}/
 */

export const PokemonColor = t.type({
  id: t.Int,
  name: t.string,
  names: t.array(Name),
  pokemon_species: t.array(NamedAPIResource), // PokemonSpecies
});

export interface IPokemonColor extends t.TypeOf<typeof PokemonColor> {}

const PokemonFormSprites = t.type({
  front_default: t.string,
  front_shiny: t.string,
});

/**
 * Some Pokémon may appear in one of multiple, visually different forms. These
 * differences are purely cosmetic. For variations within a Pokémon species,
 * which do differ in more than just visuals, the 'Pokémon' entity is used to
 * represent such a variety.
 *
 * GET https://pokeapi.co/api/v2/pokemon-form/{id or name}/
 */

export const PokemonForm = t.type({
  id: t.Int,
  name: t.string,
  order: t.Int,
  form_order: t.Int,
  is_default: t.boolean,
  is_battle_only: t.boolean,
  is_mega: t.boolean,
  form_name: t.string,
  pokemon: NamedAPIResource, // Pokemon
  sprites: PokemonFormSprites,
  version_group: NamedAPIResource, // VersionGroup
  names: t.array(Name),
  form_names: t.array(Name),
});

export interface IPokemonForm extends t.TypeOf<typeof PokemonForm> {}

const AwesomeName = t.type({
  awesome_name: t.string,
});

/**
 * Shapes used for sorting Pokémon in a Pokédex.
 *
 * GET https://pokeapi.co/api/v2/pokemon-shape/{id or name}/
 */
export const PokemonShape = t.type({
  id: t.Int,
  name: t.string,
  awesome_names: t.array(AwesomeName),
  names: t.array(Name),
  pokemon_species: t.array(NamedAPIResource), // PokemonSpecies
});

export interface IPokemonShape extends t.TypeOf<typeof PokemonShape> {}

const Genus = t.type({
  genus: t.string,
  language: NamedAPIResource, // Language
});

const PokemonSpeciesVariety = t.type({
  is_default: t.boolean,
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

export const PokemonSpecies = t.type({
  id: t.Int,
  name: t.string,
  gender_rate: t.Int,
  capture_rate: t.Int,
  base_happiness: t.Int,
  is_baby: t.boolean,
  is_legendary: t.boolean,
  is_mythical: t.boolean,
  hatch_counter: t.Int,
  has_gender_differences: t.boolean,
  forms_switchable: t.boolean,
  growth_rate: NamedAPIResource, // GrowthRate
  egg_groups: t.array(NamedAPIResource), // EggGroup
  color: NamedAPIResource, // PokemonColor
  shape: NamedAPIResource, // PokemonShape
  evolves_from_species: NamedAPIResource, // PokemonSpecies
  evolution_chain: APIResource, // EvolutionChain
  habitat: NamedAPIResource, // PokemonHabitat
  names: t.array(Name),
  flavor_text_entries: t.array(FlavorText),
  form_descriptions: t.array(Description),
  genera: t.array(Genus),
  varieties: t.array(PokemonSpeciesVariety),
});

export interface IPokemonSpecies extends t.TypeOf<typeof PokemonSpecies> {}

/*
 * -----------------------------------------------------------------------------
 * MOVES
 * -----------------------------------------------------------------------------
 */

const ContestComboDetail = t.type({
  use_before: t.union([t.array(NamedAPIResource), t.null]),
  use_after: t.union([t.array(NamedAPIResource), t.null]),
});

const ContestComboSet = t.type({
  normal: ContestComboDetail,
  super: ContestComboDetail,
});

const MoveFlavorText = t.type({
  flavor_text: t.string,
  language: NamedAPIResource,
  version_group: NamedAPIResource,
});

const MoveMetaData = t.type({
  ailment: NamedAPIResource,
  category: NamedAPIResource,
  min_hits: t.Int,
  max_hits: t.Int,
  min_turns: t.union([t.Int, t.null]),
  max_turns: t.union([t.Int, t.null]),
  drain: t.Int,
  healing: t.Int,
  crit_rate: t.Int,
  ailment_chance: t.Int,
  flinch_chance: t.Int,
  stat_chance: t.Int,
});

const MoveStatChange = t.type({
  change: t.Int,
  stat: NamedAPIResource,
});

const PastMoveStatValues = t.type({
  accuracy: t.Int,
  effect_chance: t.Int,
  power: t.Int,
  pp: t.Int,
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
export const Move = t.type({
  id: t.Int,
  name: t.string,
  accuracy: t.Int,
  effect_chance: t.union([t.Int, t.null]),
  pp: t.Int,
  priority: t.Int,
  power: t.Int,
  contest_combos: ContestComboSet,
  contest_type: NamedAPIResource,
  contest_effect: APIResource,
  damage_class: NamedAPIResource,
  effect_entries: t.array(VerboseEffect),
  effect_changes: t.array(AbilityEffectChange),
  flavor_text_entries: t.array(MoveFlavorText),
  generation: NamedAPIResource,
  machines: t.array(MachineVersionDetail),
  meta: MoveMetaData,
  names: t.array(Name),
  past_values: t.array(PastMoveStatValues),
  stat_changes: t.array(MoveStatChange),
  super_contest_effect: APIResource,
  target: NamedAPIResource,
  type: NamedAPIResource,
});

export interface IMove extends t.TypeOf<typeof Move> {}
