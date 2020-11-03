import { createAction, createReducer } from "@reduxjs/toolkit";
import { call, put, SagaGenerator, select, take } from "typed-redux-saga";
import { isRight } from "fp-ts/Either";
import {
  RootState,
  withPayload,
  Collection,
  KnownCollection,
} from "config/types";
import {
  DecoderError,
  LocationArea,
  ILocationArea,
} from "entities/decoders/Decoders";
import { apiClient, responseDecoder } from "infrastructure/RestClient";
import memoize from "memoize-one";

/******************************************************************************
 * Actions
 *****************************************************************************/

export const LocationAreaActions = {
  fetchByName: createAction("LocationArea/fetchByName", withPayload<string>()),
  fetchByNameFailed: createAction(
    "LocationArea/fetchByNameFailure",
    withPayload<Error>()
  ),
  fetchByNameSuccess: createAction(
    "LocationArea/fetchByNameSuccess",
    withPayload<{ name: string; LocationArea: ILocationArea }>()
  ),
};

/******************************************************************************
 * State & Reducer
 *****************************************************************************/

export interface ILocationAreaState {
  collection: Collection<ILocationArea>;
}

export const LocationAreaDefaultState: ILocationAreaState = {
  collection: {},
};

export const LocationAreaReducer = createReducer(
  LocationAreaDefaultState,
  (builder) => {
    builder.addCase(LocationAreaActions.fetchByNameSuccess, (state, action) => {
      const {
        payload: { name, LocationArea },
      } = action;
      state.collection[name] = LocationArea;
    });
  }
);

/******************************************************************************
 * Sagas
 *****************************************************************************/

export function* watchFetchByName(): SagaGenerator<void> {
  while (true) {
    const action = yield* take(LocationAreaActions.fetchByName);
    yield* call(fetchByName, action.payload);
  }
}

function* fetchByName(name: string): SagaGenerator<void> {
  const state = yield* select();
  const area = LocationAreaSelectors.byName(state, { name });
  if (area !== undefined) return;
  try {
    const response = yield* call(() =>
      apiClient.get<ILocationArea>(`location-area/${name}/`)
    );
    const result = responseDecoder(LocationArea)(response);
    if (isRight(result)) {
      yield* put(
        LocationAreaActions.fetchByNameSuccess({
          name: name,
          LocationArea: result.right,
        })
      );
    } else {
      const error = new DecoderError(result);
      yield* put(LocationAreaActions.fetchByNameFailed(error));
    }
  } catch (error) {
    yield* put(LocationAreaActions.fetchByNameFailed(error));
  }
}

export const LocationAreaSagas = {
  watchFetchByName,
};

/******************************************************************************
 * Selectors
 *****************************************************************************/

/* We have to memoize here since the selector returns a new array. */
const byNames = memoize((state: RootState, props: { urls: string[] }) =>
  Object.entries(
    state.LocationArea.collection as KnownCollection<ILocationArea>
  )
    .filter(([key]) => props.urls.includes(key))
    .reduce((acc, [key, form]) => {
      acc[key] = form;
      return acc;
    }, {} as Collection<ILocationArea>)
);

export const LocationAreaSelectors = {
  byName: (state: RootState, props: { name: string }) =>
    state.LocationArea.collection[props.name],
  byNames,
};
