import { createAction, createReducer } from "@reduxjs/toolkit";
import { call, put, SagaGenerator, select } from "typed-redux-saga";
import { take } from "redux-saga/effects";
import { isRight } from "fp-ts/Either";
import { RootState, withPayload, Collection } from "config/types";
import {
  DecoderError,
  INamedAPIResource,
  INamedAPIResourceList,
  IPokemon,
  IPokemonColor,
  IPokemonSpecies,
  NamedAPIResourceList,
  Pokemon,
} from "entities/decoders/Decoders";
import { apiClient, responseDecoder } from "infrastructure/RestClient";
import { PokemonColorActions, PokemonColorSagas } from "./PokemonColor";
import { AbilityActions } from "./Ability";
import { PokemonFormActions } from "./PokemonForm";
import {
  PokemonSpeciesActions,
  PokemonSpeciesSelectors,
} from "./PokemonSpecies";
import { LocationAreaActions } from "./LocationArea";
import {
  EvolutionChainActions,
  EvolutionChainSelectors,
} from "./EvolutionChain";
import { MoveActions } from "./Move";
import { PokemonLocationAreasActions } from "./PokemonLocationAreas";
import memoize from "memoize-one";

/******************************************************************************
 * Actions
 *****************************************************************************/

export const PokemonActions = {
  fetchIndex: createAction("Pokemon/fetchIndex"),
  fetchIndexFailed: createAction(
    "Pokemon/fetchIndexFailed",
    withPayload<Error>()
  ),
  fetchIndexSuccess: createAction(
    "Pokemon/fetchIndexSuccess",
    withPayload<INamedAPIResourceList>()
  ),
  fetchByName: createAction("Pokemon/fetchByName", withPayload<string>()),
  fetchByNameFailed: createAction(
    "Pokemon/fetchByNameFailed",
    withPayload<Error>()
  ),
  fetchByNameSuccess: createAction(
    "Pokemon/fetchByNameSuccess",
    withPayload<{ name: string; pokemon: IPokemon }>()
  ),
};

/******************************************************************************
 * State & Reducer
 *****************************************************************************/

export interface IPokemonState {
  index: INamedAPIResource[];
  collection: Collection<IPokemon>;
}

export const PokemonDefaultState: IPokemonState = {
  index: [],
  collection: {},
};

export const PokemonReducer = createReducer(PokemonDefaultState, (builder) => {
  builder
    .addCase(PokemonActions.fetchIndexSuccess, (state, action) => {
      const {
        payload: { results: pokemons },
      } = action;
      state.index = pokemons;
    })
    .addCase(PokemonActions.fetchByNameSuccess, (state, action) => {
      const {
        payload: { name, pokemon },
      } = action;
      state.collection[name] = pokemon;
    });
});

/******************************************************************************
 * Sagas
 *****************************************************************************/

export function* watchFetchIndex(): SagaGenerator<void> {
  while (true) {
    yield* call(fetchIndex);
  }
}

export const getPokemonIndex = () =>
  apiClient.get<INamedAPIResourceList>("pokemon/?limit=1050");

export function* fetchIndex(): SagaGenerator<void> {
  const index = yield* select(PokemonSelectors.index);
  if (index.length > 0) return;
  try {
    const response = yield * call(getPokemonIndex);
    const result = responseDecoder(NamedAPIResourceList)(response);
    if (isRight(result)) {
      yield* put(PokemonActions.fetchIndexSuccess(result.right));
    } else {
      const error = new DecoderError(result.left);
      yield* put(PokemonActions.fetchIndexFailed(error));
    }
  } catch (e) {
    console.log(e);
  }
}

export function* watchFetchByName(): SagaGenerator<void> {
  while (true) {
    const action = (yield take(PokemonActions.fetchByName)) as {
      payload: string;
    };
    yield* call(fetchByName, action.payload);
  }
}

export function* fetchByName(name: string): SagaGenerator<void> {
  let pokemon = yield* select(PokemonSelectors.byName, { name });
  if (pokemon !== undefined) return;
  try {
    const response = yield* call(() =>
      apiClient.get<IPokemon>(`pokemon/${name}`)
    );
    const maybePokemon = responseDecoder(Pokemon)(response);
    if (isRight(maybePokemon)) {
      console.log(maybePokemon.right);
      yield  *
   
            put(
            PokemonActions.fetchByNameSuccess({
              name,
              pokemon: maybePokemon.right,
            })
          );
      pokemon = maybePokemon.right;
      // fetch all of the related entities
      // yield *
      //   call(fetchRelatedEntities, {
      //     abilities: pokemon.abilities.map((a) => a.ability.name),
      //     // pokemonForms: pokemon.forms.map((f) => f.name),
      //     pokemonSpecies: pokemon.species.name,
      //     pokemonLocationAreasUrl: pokemon.location_area_encounters,
      //     move: pokemon.moves.map((m) => m.move.name),
      //   });
    } else {
      const error = new DecoderError(maybePokemon.left);
      yield* put(PokemonActions.fetchByNameFailed(error));
    }
  } catch (error) {
    yield* put(PokemonActions.fetchByNameFailed(error));
  }
}

// function* fetchRelatedEntities(names: {
//   abilities: string[];
//   // pokemonForms: string[];
//   pokemonSpecies: string;
//   pokemonLocationAreasUrl: string;
//   move: string[];
// }): SagaGenerator<void> {
//   yield * put(AbilityActions.fetchByNames(names.abilities));
//   // yield* put(PokemonFormActions.fetchByNames(names.pokemonForms));
//   yield *
//     put(PokemonLocationAreasActions.fetchByUrl(names.pokemonLocationAreasUrl));
//   yield * put(MoveActions.fetchByNames(names.move));
//   // We need the species entity before we can get the color and evolution names
//   yield * put(PokemonSpeciesActions.fetchByName(names.pokemonSpecies));
//   const action = (yield take([
//     PokemonSpeciesActions.fetchByNameSuccess.toString(),
//     PokemonSpeciesActions.fetchByNameFailed.toString(),
//   ])) as SpeciesActions;
//   if (action.type === "PokemonSpecies/fetchByNameSuccess") {
//     const state = yield * select();
//     const species = PokemonSpeciesSelectors.byName(state, {
//       name: names.pokemonSpecies,
//     }) as IPokemonSpecies;
//     const evolutionUrl = species.evolution_chain.url;
//     const pokemonColor = species.color.name;
//     yield * put(PokemonColorActions.fetchByName(pokemonColor));
//     yield * put(EvolutionChainActions.fetchByUrl(evolutionUrl));
//   }
// }

type SpeciesActions =
  | { type: "PokemonSpecies/fetchByNameSuccess"; payload: IPokemonSpecies }
  | { type: "PokemonSpecies/fetchByNameFailed"; payload: Error };

export const PokemonSagas = {
  watchFetchIndex,
  watchFetchByName,
};

/******************************************************************************
 * Selectors
 *****************************************************************************/

const selectIndex = (state: RootState) => state.Pokemon.index;
const selectCollection = (state: RootState) => state.Pokemon.collection;
const selectByName = (state: RootState, props: { name: string }) =>
  selectCollection(state)[props.name];
const selectAbilities = memoize((state: RootState, props: { name: string }) =>
  selectByName(state, props)?.abilities.map((a) => a.ability.name)
);
const selectArtwork = (state: RootState, props: { name: string }) =>
  selectByName(state, props)?.sprites.other["official-artwork"].front_default ??
  "/images/artwork-default.png";

export const PokemonSelectors = {
  index: selectIndex,
  collection: selectCollection,
  byName: selectByName,
  abilities: selectAbilities,
  artwork: selectArtwork,
};
