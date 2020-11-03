import { createAction, createReducer } from "@reduxjs/toolkit";
import { call, put, SagaGenerator, select, take } from "typed-redux-saga";
import { isRight } from "fp-ts/Either";
import { RootState, withPayload, Collection } from "config/types";
import {
  DecoderError,
  PokemonLocationAreas,
  IPokemonLocationAreas,
} from "entities/decoders/Decoders";
import { apiClient, responseDecoder } from "infrastructure/RestClient";

/******************************************************************************
 * Actions
 *****************************************************************************/

export const PokemonLocationAreasActions = {
  fetchByUrl: createAction(
    "PokemonLocationAreas/fetchByUrl",
    withPayload<string>()
  ),
  fetchByUrlFailed: createAction(
    "PokemonLocationAreas/fetchByUrlFailure",
    withPayload<Error>()
  ),
  fetchByUrlSuccess: createAction(
    "PokemonLocationAreas/fetchByUrlSuccess",
    withPayload<{ url: string; PokemonLocationAreas: IPokemonLocationAreas }>()
  ),
};

/******************************************************************************
 * State & Reducer
 *****************************************************************************/

export interface IPokemonLocationAreasState {
  collection: Collection<IPokemonLocationAreas>;
}

export const PokemonLocationAreasDefaultState: IPokemonLocationAreasState = {
  collection: {},
};

export const PokemonLocationAreasReducer = createReducer(
  PokemonLocationAreasDefaultState,
  (builder) => {
    builder.addCase(
      PokemonLocationAreasActions.fetchByUrlSuccess,
      (state, action) => {
        const {
          payload: { url, PokemonLocationAreas },
        } = action;
        state.collection[url] = PokemonLocationAreas;
      }
    );
  }
);

/******************************************************************************
 * Sagas
 *****************************************************************************/

export function* watchFetchByUrl(): SagaGenerator<void> {
  while (true) {
    const action = yield* take(PokemonLocationAreasActions.fetchByUrl);
    yield* call(fetchByUrl, action.payload);
  }
}

function* fetchByUrl(url: string): SagaGenerator<void> {
  const state = yield* select();
  const areas = PokemonLocationAreasSelectors.byUrl(state, { url });
  if (areas !== undefined) return;
  try {
    const response = yield* call(() =>
      apiClient.get<IPokemonLocationAreas>(url)
    );
    const result = responseDecoder(PokemonLocationAreas)(response);
    if (isRight(result)) {
      yield* put(
        PokemonLocationAreasActions.fetchByUrlSuccess({
          url,
          PokemonLocationAreas: result.right,
        })
      );
    } else {
      const error = new DecoderError(result);
      yield* put(PokemonLocationAreasActions.fetchByUrlFailed(error));
    }
  } catch (error) {
    yield* put(PokemonLocationAreasActions.fetchByUrlFailed(error));
  }
}

export const PokemonLocationAreasSagas = {
  watchFetchByUrl,
};

/******************************************************************************
 * Selectors
 *****************************************************************************/

export const PokemonLocationAreasSelectors = {
  collection: (state: RootState) => state.PokemonLocationAreas.collection,
  byUrl: (state: RootState, props: { url: string }) =>
    state.PokemonLocationAreas.collection[props.url],
};
