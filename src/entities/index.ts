import { ActionTypes } from "config/types";
import { PokemonActions } from "entities/Pokemon";
import { AbilityActions } from "entities/Ability";
import { EvolutionChainActions } from "./EvolutionChain";
import { PokemonColorActions } from "./PokemonColor";
import { PokemonFormActions } from "./PokemonForm";
import { PokemonSpeciesActions } from "./PokemonSpecies";
import { MoveActions } from "./Move";
import { RegionActions } from "./Region";
import { LocationActions } from "./Location";
import { LocationAreaActions } from "./LocationArea";
import { PokemonLocationAreasActions } from "./PokemonLocationAreas";

export type EntityActions =
  | ActionTypes<typeof PokemonActions>
  | ActionTypes<typeof AbilityActions>
  | ActionTypes<typeof EvolutionChainActions>
  | ActionTypes<typeof PokemonColorActions>
  | ActionTypes<typeof PokemonFormActions>
  | ActionTypes<typeof PokemonSpeciesActions>
  | ActionTypes<typeof PokemonLocationAreasActions>
  | ActionTypes<typeof MoveActions>
  | ActionTypes<typeof RegionActions>
  | ActionTypes<typeof LocationActions>
  | ActionTypes<typeof LocationAreaActions>;
