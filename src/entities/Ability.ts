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
import { DecoderError, Ability, IAbility } from "entities/decoders/Decoders";
import { apiClient, responseDecoder } from "infrastructure/RestClient";
import memoize from "memoize-one";

/******************************************************************************
 * Actions
 *****************************************************************************/

export const AbilityActions = {
  fetchByNames: createAction("Ability/fetchByName", withPayload<string[]>()),
  fetchByNameFailed: createAction(
    "Ability/fetchByNameFailure",
    withPayload<Error>()
  ),
  fetchByNameSuccess: createAction(
    "Ability/fetchByNameSuccess",
    withPayload<{ name: string; Ability: IAbility }>()
  ),
};

/******************************************************************************
 * State & Reducer
 *****************************************************************************/

export interface IAbilityState {
  collection: Collection<IAbility>;
}

export const AbilityDefaultState: IAbilityState = {
  collection: {},
};

export const AbilityReducer = createReducer(AbilityDefaultState, (builder) => {
  builder.addCase(AbilityActions.fetchByNameSuccess, (state, action) => {
    const {
      payload: { name, Ability },
    } = action;
    state.collection[name] = Ability;
  });
});

/******************************************************************************
 * Sagas
 *****************************************************************************/

export function* watchFetchByNames(): SagaGenerator<void> {
  while (true) {
    const action = yield* take(AbilityActions.fetchByNames);
    yield* call({ context: null, fn: fetchByNames }, action.payload);
  }
}

function* fetchByNames(names: string[]): SagaGenerator<void> {
  for (let name of names) {
    yield* spawn(fetchByName, name);
  }
}

function* fetchByName(name: string): SagaGenerator<void> {
  const state = yield* select();
  let ability = AbilitySelectors.byName(state, { name });
  if (ability !== undefined) {
    yield* put(AbilityActions.fetchByNameSuccess({ name, Ability: ability }));
    return;
  }
  try {
    const response = yield* call(() =>
      apiClient.get<IAbility>(`ability/${name}`)
    );
    const maybeAbility = responseDecoder(Ability)(response);
    if (isRight(maybeAbility)) {
      yield* put(
        AbilityActions.fetchByNameSuccess({ name, Ability: maybeAbility.right })
      );
    } else {
      const error = new DecoderError(maybeAbility);
      yield* put(AbilityActions.fetchByNameFailed(error));
    }
  } catch (error) {
    yield* put(AbilityActions.fetchByNameFailed(error));
  }
  return ability;
}

export const AbilitySagas = {
  watchFetchByNames,
};

/******************************************************************************
 * Selectors
 *****************************************************************************/

/* We have to memoize here since the selector returns a new array. */
const byNames = memoize((state: RootState, props: { names: string[] }) =>
  Object.entries(state.Ability.collection as KnownCollection<IAbility>)
    .filter(([key]) => props.names.includes(key))
    .reduce((acc, [key, form]) => {
      acc[key] = form;
      return acc;
    }, {} as Collection<IAbility>)
);

export const AbilitySelectors = {
  byName: (state: RootState, props: { name: string }) =>
    state.Ability.collection[props.name],
  byNames,
};
