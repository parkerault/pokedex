import { createAction, createReducer } from "@reduxjs/toolkit";
import {
  call,
  put,
  SagaGenerator,
  select,
  take,
  takeEvery,
} from "typed-redux-saga";
import { isRight } from "fp-ts/Either";
import { RootState, withPayload, Collection, RootAction } from "config/types";
import { apiClient, responseDecoder } from "infrastructure/RestClient";
import { LocationChangeAction, LOCATION_CHANGE } from "connected-react-router";
import { LocationState } from "history";

/******************************************************************************
 * Actions
 *****************************************************************************/

export const PokemonSearchActions = {
  setInputState: createAction(
    "PokemonSearch/setInputState",
    withPayload<string>()
  ),
  updateSearchHistory: createAction(
    "PokemonSearch/updateSearchHistory",
    withPayload<string>()
  ),
};

/******************************************************************************
 * State & Reducer
 *****************************************************************************/

export interface IPokemonSearchState {
  collection: string[];
  input: string;
}

export const PokemonSearchDefaultState: IPokemonSearchState = {
  collection: [],
  input: "",
};

export const PokemonSearchReducer = createReducer(
  PokemonSearchDefaultState,
  (builder) => {
    builder
      .addCase(PokemonSearchActions.updateSearchHistory, (state, action) => {
        const { payload: searchString } = action;
        if (!state.collection.includes(searchString))
          state.collection.push(searchString);
      })
      .addCase(PokemonSearchActions.setInputState, (state, action) => {
        const { payload: searchString } = action;
        state.input = searchString;
      })
      .addMatcher(routeChangeMatcher, (state) => {
        console.info("changed routes");
        state.input = "";
      });
  }
);

function routeChangeMatcher(
  action: any
): action is LocationChangeAction<LocationState> {
  return action.type === LOCATION_CHANGE;
}

/******************************************************************************
 * Sagas
 *****************************************************************************/
// export const PokemonSearchSagas = {}

/******************************************************************************
 * Selectors
 *****************************************************************************/

export const PokemonSearchSelectors = {
  input: (state: RootState) => state.views.PokemonSearch.input,
  history: (state: RootState) => state.views.PokemonSearch.collection,
};
