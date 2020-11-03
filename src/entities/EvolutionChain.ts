import { createAction, createReducer } from "@reduxjs/toolkit";
import { call, put, SagaGenerator, select, take } from "typed-redux-saga";
import { isRight } from "fp-ts/Either";
import { RootState, withPayload, Collection } from "config/types";
import {
  DecoderError,
  EvolutionChain,
  IEvolutionChain,
} from "entities/decoders/Decoders";
import { apiClient, responseDecoder } from "infrastructure/RestClient";

/******************************************************************************
 * Actions
 *****************************************************************************/

export const EvolutionChainActions = {
  fetchByUrl: createAction("EvolutionChain/fetchByUrl", withPayload<string>()),
  fetchByUrlFailed: createAction(
    "EvolutionChain/fetchByUrlFailure",
    withPayload<Error>()
  ),
  fetchByUrlSuccess: createAction(
    "EvolutionChain/fetchByUrlSuccess",
    withPayload<{ id: string; EvolutionChain: IEvolutionChain }>()
  ),
};

/******************************************************************************
 * State & Reducer
 *****************************************************************************/

export interface IEvolutionChainState {
  collection: Collection<IEvolutionChain>;
}

export const EvolutionChainDefaultState: IEvolutionChainState = {
  collection: {},
};

export const EvolutionChainReducer = createReducer(
  EvolutionChainDefaultState,
  (builder) => {
    builder.addCase(
      EvolutionChainActions.fetchByUrlSuccess,
      (state, action) => {
        const {
          payload: { id: name, EvolutionChain },
        } = action;
        state.collection[name] = EvolutionChain;
      }
    );
  }
);

/******************************************************************************
 * Sagas
 *****************************************************************************/

export function* watchFetchById(): SagaGenerator<void> {
  while (true) {
    const action = yield* take(EvolutionChainActions.fetchByUrl);
    yield* call({ context: null, fn: fetchByUrl }, action.payload);
  }
}

/**
 * Annoyingly, evolution chain is the only relation that returns a url instead
 * of a name and url pair, so we have to extrac the id.
 */
function* fetchByUrl(url: string): SagaGenerator<void> {
  const match = url.match(/evolution-chain\/(\d+)/);
  if (match === null) {
    const error = new Error(`Invalid url: ${url}`);
    yield* put(EvolutionChainActions.fetchByUrlFailed(error));
    return;
  }
  const id = match[1];
  const state = yield* select();
  const chain = EvolutionChainSelectors.byId(state, { id });
  if (chain !== undefined) return;
  try {
    const response = yield* call(() =>
      apiClient.get<IEvolutionChain>(`evolution-chain/${id}`)
    );
    const result = responseDecoder(EvolutionChain)(response);
    if (isRight(result)) {
      yield* put(
        EvolutionChainActions.fetchByUrlSuccess({
          id: url,
          EvolutionChain: result.right,
        })
      );
    } else {
      const error = new DecoderError(result);
      yield* put(EvolutionChainActions.fetchByUrlFailed(error));
    }
  } catch (error) {
    yield* put(EvolutionChainActions.fetchByUrlFailed(error));
  }
}

export const EvolutionChainSagas = {
  watchFetchById,
};

/******************************************************************************
 * Selectors
 *****************************************************************************/

export const EvolutionChainSelectors = {
  collection: (state: RootState) => state.EvolutionChain.collection,
  byId: (state: RootState, props: { id: string }) =>
    state.EvolutionChain.collection[props.id],
};
