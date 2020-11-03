import { createAction, createReducer } from "@reduxjs/toolkit";
import { call, put, SagaGenerator, select, take } from "typed-redux-saga";
import { isRight } from "fp-ts/Either";
import {
  RootState,
  withPayload,
  Collection,
  KnownCollection,
} from "config/types";
import { DecoderError, Location, ILocation } from "entities/decoders/Decoders";
import { apiClient, responseDecoder } from "infrastructure/RestClient";
import memoize from "memoize-one";

/******************************************************************************
 * Actions
 *****************************************************************************/

export const LocationActions = {
  fetchByName: createAction("Location/fetchByName", withPayload<string>()),
  fetchByNameFailed: createAction(
    "Location/fetchByNameFailure",
    withPayload<Error>()
  ),
  fetchByNameSuccess: createAction(
    "Location/fetchByNameSuccess",
    withPayload<{ name: string; Location: ILocation }>()
  ),
};

/******************************************************************************
 * State & Reducer
 *****************************************************************************/

export interface ILocationState {
  collection: Collection<ILocation>;
}

export const LocationDefaultState: ILocationState = {
  collection: {},
};

export const LocationReducer = createReducer(
  LocationDefaultState,
  (builder) => {
    builder.addCase(LocationActions.fetchByNameSuccess, (state, action) => {
      const {
        payload: { name, Location },
      } = action;
      state.collection[name] = Location;
    });
  }
);

/******************************************************************************
 * Sagas
 *****************************************************************************/

export function* watchFetchByName(): SagaGenerator<void> {
  while (true) {
    const action = yield* take(LocationActions.fetchByName);
    yield* call({ context: null, fn: fetchByName }, action.payload);
  }
}

function* fetchByName(name: string): SagaGenerator<void> {
  const state = yield* select();
  const location = LocationSelectors.byName(state, { name });
  if (location !== undefined) return;
  try {
    const response = yield* call(() =>
      apiClient.get<ILocation>(`location/${name}`)
    );
    const result = responseDecoder(Location)(response);
    if (isRight(result)) {
      yield* put(
        LocationActions.fetchByNameSuccess({ name, Location: result.right })
      );
    } else {
      const error = new DecoderError(result);
      yield* put(LocationActions.fetchByNameFailed(error));
    }
  } catch (error) {
    yield* put(LocationActions.fetchByNameFailed(error));
  }
}

export const LocationSagas = {
  watchFetchByName,
};

/******************************************************************************
 * Selectors
 *****************************************************************************/

/* We have to memoize here since the selector returns a new array. */
const byNames = memoize((state: RootState, props: { names: string[] }) =>
  Object.entries(state.Location.collection as KnownCollection<ILocation>)
    .filter(([key]) => props.names.includes(key))
    .reduce((acc, [key, form]) => {
      acc[key] = form;
      return acc;
    }, {} as Collection<ILocation>)
);

export const LocationSelectors = {
  byName: (state: RootState, props: { name: string }) =>
    state.Location.collection[props.name],
  byNames,
};
