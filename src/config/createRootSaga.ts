import { AbilitySagas } from "entities/Ability";
import { EvolutionChainSagas } from "entities/EvolutionChain";
import { LocationSagas } from "entities/Location";
import { LocationAreaSagas } from "entities/LocationArea";
import { MoveSagas } from "entities/Move";
import { PokemonSagas } from "entities/Pokemon";
import { PokemonColorSagas } from "entities/PokemonColor";
import { PokemonFormSagas } from "entities/PokemonForm";
import { PokemonLocationAreasSagas } from "entities/PokemonLocationAreas";
import { PokemonSpeciesSagas } from "entities/PokemonSpecies";
import { RegionSagas } from "entities/Region";
import { fork, SagaGenerator } from "typed-redux-saga";

export default function createRootSaga() {
  return function* rootSaga(): SagaGenerator<void> {
    yield* fork(PokemonSagas.watchFetchIndex);
    yield* fork(PokemonSagas.watchFetchByName);
    yield* fork(AbilitySagas.watchFetchByNames);
    yield* fork(EvolutionChainSagas.watchFetchById);
    yield* fork(PokemonColorSagas.watchFetchByName);
    yield* fork(PokemonFormSagas.watchFetchByNames);
    yield* fork(PokemonSpeciesSagas.watchFetchByName);
    yield* fork(PokemonLocationAreasSagas.watchFetchByUrl);
    yield* fork(MoveSagas.watchFetchByNames);
    // yield* fork(RegionSagas.watchFetchByName);
    // yield* fork(LocationSagas.watchFetchByName);
    // yield* fork(LocationAreaSagas.watchFetchByName);
  };
}
