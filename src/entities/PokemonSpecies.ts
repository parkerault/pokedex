import { createAction, createReducer } from "@reduxjs/toolkit";
import { call, put, SagaGenerator, select, take } from "typed-redux-saga";
import { isRight } from "fp-ts/Either";
import { RootState, withPayload, Collection } from "config/types";
import {
  DecoderError,
  PokemonSpecies,
  IPokemonSpecies,
} from "entities/decoders/Decoders";
import { apiClient, responseDecoder } from "infrastructure/RestClient";

/******************************************************************************
 * Actions
 *****************************************************************************/

export const PokemonSpeciesActions = {
  fetchByName: createAction(
    "PokemonSpecies/fetchByName",
    withPayload<string>()
  ),
  fetchByNameFailed: createAction(
    "PokemonSpecies/fetchByNameFailure",
    withPayload<Error>()
  ),
  fetchByNameSuccess: createAction(
    "PokemonSpecies/fetchByNameSuccess",
    withPayload<{ name: string; PokemonSpecies: IPokemonSpecies }>()
  ),
};

/******************************************************************************
 * State & Reducer
 *****************************************************************************/

export interface IPokemonSpeciesState {
  collection: Collection<IPokemonSpecies>;
}

export const PokemonSpeciesDefaultState: IPokemonSpeciesState = {
  collection: {},
};

export const PokemonSpeciesReducer = createReducer(
  PokemonSpeciesDefaultState,
  (builder) => {
    builder.addCase(
      PokemonSpeciesActions.fetchByNameSuccess,
      (state, action) => {
        const {
          payload: { name, PokemonSpecies },
        } = action;
        state.collection[name] = PokemonSpecies;
      }
    );
  }
);

/******************************************************************************
 * Sagas
 *****************************************************************************/

export function* watchFetchByName(): SagaGenerator<void> {
  while (true) {
    const action = yield* take(PokemonSpeciesActions.fetchByName);
    yield* call({ context: null, fn: fetchByName }, action.payload);
  }
}

function* fetchByName(name: string): SagaGenerator<void> {
  const state = yield* select();
  const species = PokemonSpeciesSelectors.byName(state, { name });
  if (species !== undefined) return;
  try {
    const response = yield* call(() =>
      apiClient.get<IPokemonSpecies>(`pokemon-species/${name}`)
    );
    const result = responseDecoder(PokemonSpecies)(response);
    if (isRight(result)) {
      yield* put(
        PokemonSpeciesActions.fetchByNameSuccess({
          name,
          PokemonSpecies: result.right,
        })
      );
    } else {
      const error = new DecoderError(result);
      yield* put(PokemonSpeciesActions.fetchByNameFailed(error));
    }
  } catch (error) {
    yield* put(PokemonSpeciesActions.fetchByNameFailed(error));
  }
}

export const PokemonSpeciesSagas = {
  watchFetchByName,
};

/******************************************************************************
 * Selectors
 *****************************************************************************/

export const PokemonSpeciesSelectors = {
  collection: (state: RootState) => state.PokemonSpecies.collection,
  byName: (state: RootState, props: { name: string }) =>
    state.PokemonSpecies.collection[props.name],
};
