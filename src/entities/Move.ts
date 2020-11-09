import { createAction, createReducer } from "@reduxjs/toolkit";
import {
  spawn,
  call,
  put,
  SagaGenerator,
  select,
  take,
} from "typed-redux-saga";
import { isRight } from "fp-ts/Either";
import {
  RootState,
  withPayload,
  Collection,
  KnownCollection,
} from "config/types";
import { DecoderError, Move, IMove } from "entities/decoders/Decoders";
import { apiClient, responseDecoder } from "infrastructure/RestClient";
import memoize from "memoize-one";

/******************************************************************************
 * Actions
 *****************************************************************************/

export const MoveActions = {
  fetchByNames: createAction("Move/fetchByNames", withPayload<string[]>()),
  fetchByNameFailed: createAction(
    "Move/fetchByNameFailure",
    withPayload<Error>()
  ),
  fetchByNameSuccess: createAction(
    "Move/fetchByNameSuccess",
    withPayload<{ name: string; Move: IMove }>()
  ),
};

/******************************************************************************
 * State & Reducer
 *****************************************************************************/

export interface IMoveState {
  collection: Collection<IMove>;
}

export const MoveDefaultState: IMoveState = {
  collection: {},
};

export const MoveReducer = createReducer(MoveDefaultState, (builder) => {
  builder.addCase(MoveActions.fetchByNameSuccess, (state, action) => {
    const {
      payload: { name, Move },
    } = action;
    state.collection[name] = Move;
  });
});

/******************************************************************************
 * Sagas
 *****************************************************************************/

export function* watchFetchByNames(): SagaGenerator<void> {
  while (true) {
    const action = yield* take(MoveActions.fetchByNames);
    yield* call(fetchByNames, action.payload);
  }
}

function* fetchByNames(names: string[]): SagaGenerator<void> {
  for (let name of names) {
    yield* spawn(fetchByName, name);
  }
}

function* fetchByName(name: string): SagaGenerator<void> {
  const state = yield* select();
  const move = MoveSelectors.byName(state, { name });
  if (move !== undefined) return;
  try {
    const response = yield* call(() => apiClient.get<IMove>(`move/${name}`));
    const result = responseDecoder(Move)(response);
    if (isRight(result)) {
      yield* put(MoveActions.fetchByNameSuccess({ name, Move: result.right }));
    } else {
      const error = new DecoderError(result.left);
      yield* put(MoveActions.fetchByNameFailed(error));
    }
  } catch (error) {
    yield* put(MoveActions.fetchByNameFailed(error));
  }
}

export const MoveSagas = {
  watchFetchByNames,
};

/******************************************************************************
 * Selectors
 *****************************************************************************/

/* We have to memoize here since the selector returns a new array. */
const byNames = memoize((state: RootState, props: { names: string[] }) =>
  Object.entries(state.Move.collection as KnownCollection<IMove>)
    .filter(([key]) => props.names.includes(key))
    .reduce((acc, [key, form]) => {
      acc[key] = form;
      return acc;
    }, {} as Collection<IMove>)
);

export const MoveSelectors = {
  collection: (state: RootState) => state.Move.collection,
  byName: (state: RootState, props: { name: string }) =>
    state.Move.collection[props.name],
  byNames,
};
