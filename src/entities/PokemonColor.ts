import { createAction, createReducer } from "@reduxjs/toolkit";
import { call, put, SagaGenerator, select, take } from "typed-redux-saga";
import { isRight } from "fp-ts/Either";
import { RootState, withPayload, Collection } from "config/types";
import {
  DecoderError,
  PokemonColor,
  IPokemonColor,
} from "entities/decoders/Decoders";
import { apiClient, responseDecoder } from "infrastructure/RestClient";

/******************************************************************************
 * Actions
 *****************************************************************************/

export const PokemonColorActions = {
  fetchByName: createAction("PokemonColor/fetchByName", withPayload<string>()),
  fetchByNameFailed: createAction(
    "PokemonColor/fetchByNameFailure",
    withPayload<Error>()
  ),
  fetchByNameSuccess: createAction(
    "PokemonColor/fetchByNameSuccess",
    withPayload<{ name: string; PokemonColor: IPokemonColor }>()
  ),
};

/******************************************************************************
 * State & Reducer
 *****************************************************************************/

export interface IPokemonColorState {
  collection: Collection<IPokemonColor>;
}

export const PokemonColorDefaultState: IPokemonColorState = {
  collection: {},
};

export const PokemonColorReducer = createReducer(
  PokemonColorDefaultState,
  (builder) => {
    builder.addCase(PokemonColorActions.fetchByNameSuccess, (state, action) => {
      const {
        payload: { name, PokemonColor },
      } = action;
      state.collection[name] = PokemonColor;
    });
  }
);

/******************************************************************************
 * Sagas
 *****************************************************************************/

export function* watchFetchByName(): SagaGenerator<void> {
  while (true) {
    const action = yield* take(PokemonColorActions.fetchByName);
    yield* call({ context: null, fn: fetchByName }, action.payload);
  }
}

function* fetchByName(name: string): SagaGenerator<void> {
  const state = yield* select();
  const color = PokemonColorSelectors.byName(state, { name });
  if (color !== undefined) return;
  try {
    const response = yield* call(() =>
      apiClient.get<IPokemonColor>(`pokemon-color/${name}`)
    );
    const result = responseDecoder(PokemonColor)(response);
    if (isRight(result)) {
      yield* put(
        PokemonColorActions.fetchByNameSuccess({
          name,
          PokemonColor: result.right,
        })
      );
    } else {
      const error = new DecoderError(result);
      yield* put(PokemonColorActions.fetchByNameFailed(error));
    }
  } catch (error) {
    yield* put(PokemonColorActions.fetchByNameFailed(error));
  }
}

export const PokemonColorSagas = {
  watchFetchByName,
};

/******************************************************************************
 * Selectors
 *****************************************************************************/

export const PokemonColorSelectors = {
  collection: (state: RootState) => state.PokemonColor.collection,
  byName: (state: RootState, props: { name: string }) =>
    state.PokemonColor.collection[props.name],
};
