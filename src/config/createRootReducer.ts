import { combineReducers, Reducer } from "redux";
import { connectRouter } from "connected-react-router";
import { History } from "history";
import { RootAction, RootState } from "./types";
import { PokemonReducer } from "entities/Pokemon";
import { AbilityReducer } from "entities/Ability";
import { EvolutionChainReducer } from "entities/EvolutionChain";
import { PokemonColorReducer } from "entities/PokemonColor";
import { PokemonFormReducer } from "entities/PokemonForm";
import { PokemonSpeciesReducer } from "entities/PokemonSpecies";
import { MoveReducer } from "entities/Move";
import { RegionReducer } from "entities/Region";
import { LocationReducer } from "entities/Location";
import { LocationAreaReducer } from "entities/LocationArea";
import { PokemonLocationAreasReducer } from "entities/PokemonLocationAreas";
import { PokemonSearchReducer } from "features/PokemonSearch";

export default function createRootReducer(
  history: History
): Reducer<RootState, RootAction> {
  return combineReducers({
    router: connectRouter(history),
    Pokemon: PokemonReducer,
    Ability: AbilityReducer,
    EvolutionChain: EvolutionChainReducer,
    PokemonColor: PokemonColorReducer,
    PokemonForm: PokemonFormReducer,
    PokemonSpecies: PokemonSpeciesReducer,
    PokemonLocationAreas: PokemonLocationAreasReducer,
    Move: MoveReducer,
    Region: RegionReducer,
    Location: LocationReducer,
    LocationArea: LocationAreaReducer,
    views: combineReducers({
      PokemonSearch: PokemonSearchReducer,
    }),
  });
}
