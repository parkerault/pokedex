import { RouterState } from "connected-react-router";
import { AbilityDefaultState } from "entities/Ability";
import { EvolutionChainDefaultState } from "entities/EvolutionChain";
import { LocationDefaultState } from "entities/Location";
import { LocationAreaDefaultState } from "entities/LocationArea";
import { MoveDefaultState } from "entities/Move";
import { PokemonDefaultState } from "entities/Pokemon";
import { PokemonColorDefaultState } from "entities/PokemonColor";
import { PokemonFormDefaultState } from "entities/PokemonForm";
import { PokemonLocationAreasDefaultState } from "entities/PokemonLocationAreas";
import { PokemonSpeciesDefaultState } from "entities/PokemonSpecies";
import { RegionDefaultState } from "entities/Region";
import {} from "history";

export default function createDefaultState() {
  return {
    router: (undefined as any) as RouterState,
    Pokemon: PokemonDefaultState,
    Ability: AbilityDefaultState,
    EvolutionChain: EvolutionChainDefaultState,
    PokemonColor: PokemonColorDefaultState,
    PokemonForm: PokemonFormDefaultState,
    PokemonSpecies: PokemonSpeciesDefaultState,
    PokemonLocationAreas: PokemonLocationAreasDefaultState,
    Move: MoveDefaultState,
    Region: RegionDefaultState,
    Location: LocationDefaultState,
    LocationArea: LocationAreaDefaultState,
    // views: {},
  };
}
