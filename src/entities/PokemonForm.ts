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
import {
  DecoderError,
  PokemonForm,
  IPokemonForm,
} from "entities/decoders/Decoders";
import { apiClient, responseDecoder } from "infrastructure/RestClient";
import memoize from "memoize-one";

/******************************************************************************
 * Actions
 *****************************************************************************/

export const PokemonFormActions = {
  fetchByNames: createAction(
    "PokemonForm/fetchByNames",
    withPayload<string[]>()
  ),
  fetchByNameFailed: createAction(
    "PokemonForm/fetchByNameFailure",
    withPayload<Error>()
  ),
  fetchByNameSuccess: createAction(
    "PokemonForm/fetchByNameSuccess",
    withPayload<{ name: string; PokemonForm: IPokemonForm }>()
  ),
};

/******************************************************************************
 * State & Reducer
 *****************************************************************************/

export interface IPokemonFormState {
  collection: Collection<IPokemonForm>;
}

export const PokemonFormDefaultState: IPokemonFormState = {
  collection: {},
};

export const PokemonFormReducer = createReducer(
  PokemonFormDefaultState,
  (builder) => {
    builder.addCase(PokemonFormActions.fetchByNameSuccess, (state, action) => {
      const {
        payload: { name, PokemonForm },
      } = action;
      state.collection[name] = PokemonForm;
    });
  }
);

/******************************************************************************
 * Sagas
 *****************************************************************************/

function* watchFetchByNames(): SagaGenerator<void> {
  while (true) {
    const action = yield* take(PokemonFormActions.fetchByNames);
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
  const form = PokemonFormSelectors.byName(state, { name });
  if (form !== undefined) return;
  try {
    const response = yield* call(() =>
      apiClient.get<IPokemonForm>(`pokemon-form/${name}`)
    );
    const result = responseDecoder(PokemonForm)(response);
    if (isRight(result)) {
      yield* put(
        PokemonFormActions.fetchByNameSuccess({
          name,
          PokemonForm: result.right,
        })
      );
    } else {
      const error = new DecoderError(result);
      yield* put(PokemonFormActions.fetchByNameFailed(error));
    }
  } catch (error) {
    yield* put(PokemonFormActions.fetchByNameFailed(error));
  }
}

export const PokemonFormSagas = {
  watchFetchByNames,
};

/******************************************************************************
 * Selectors
 *****************************************************************************/

/* We have to memoize here since the selector returns a new array. */
const byNames = memoize((state: RootState, props: { names: string[] }) =>
  Object.entries(state.PokemonForm.collection as KnownCollection<IPokemonForm>)
    .filter(([key]) => props.names.includes(key))
    .reduce((acc, [key, form]) => {
      acc[key] = form;
      return acc;
    }, {} as Collection<IPokemonForm>)
);

export const PokemonFormSelectors = {
  byName: (state: RootState, props: { name: string }) =>
    state.PokemonForm.collection[props.name],
  byNames,
};
