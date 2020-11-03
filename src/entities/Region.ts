import { createAction, createReducer } from "@reduxjs/toolkit";
import { call, put, SagaGenerator, select, take } from "typed-redux-saga";
import { isRight } from "fp-ts/Either";
import { RootState, withPayload, Collection } from "config/types";
import { DecoderError, Region, IRegion } from "entities/decoders/Decoders";
import { apiClient, responseDecoder } from "infrastructure/RestClient";

/******************************************************************************
 * Actions
 *****************************************************************************/

export const RegionActions = {
  fetchByName: createAction("Region/fetchByName", withPayload<string>()),
  fetchByNameFailed: createAction(
    "Region/fetchByNameFailure",
    withPayload<Error>()
  ),
  fetchByNameSuccess: createAction(
    "Region/fetchByNameSuccess",
    withPayload<{ name: string; Region: IRegion }>()
  ),
};

/******************************************************************************
 * State & Reducer
 *****************************************************************************/

export interface IRegionState {
  collection: Collection<IRegion>;
}

export const RegionDefaultState: IRegionState = {
  collection: {},
};

export const RegionReducer = createReducer(RegionDefaultState, (builder) => {
  builder.addCase(RegionActions.fetchByNameSuccess, (state, action) => {
    const {
      payload: { name, Region },
    } = action;
    state.collection[name] = Region;
  });
});

/******************************************************************************
 * Sagas
 *****************************************************************************/

export function* watchFetchByName(): SagaGenerator<void> {
  while (true) {
    const action = yield* take(RegionActions.fetchByName);
    yield* call(fetchByName, action.payload);
  }
}

function* fetchByName(name: string): SagaGenerator<void> {
  const state = yield* select();
  const region = RegionSelectors.byName(state, { name });
  if (region !== undefined) return;
  try {
    const response = yield* call(() =>
      apiClient.get<IRegion>(`region/${name}`)
    );
    const result = responseDecoder(Region)(response);
    if (isRight(result)) {
      yield* put(
        RegionActions.fetchByNameSuccess({ name, Region: result.right })
      );
    } else {
      const error = new DecoderError(result);
      yield* put(RegionActions.fetchByNameFailed(error));
    }
  } catch (error) {
    yield* put(RegionActions.fetchByNameFailed(error));
  }
}

export const RegionSagas = {
  watchFetchByName,
};

/******************************************************************************
 * Selectors
 *****************************************************************************/

export const RegionSelectors = {
  byName: (state: RootState, props: { name: string }) =>
    state.Region.collection[props.name],
};
