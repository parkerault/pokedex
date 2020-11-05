import { applyMiddleware, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { routerMiddleware as createRouterMiddleware } from "connected-react-router";
import { createLogger } from "redux-logger";

import { LocalStorageKeys, LocalStorageObject } from "config/types";
import createRootReducer from "config/createRootReducer";
import createDefaultState from "config/createDefaultState";
import { History } from "history";
import createRootSaga from "./createRootSaga";
import { throttle } from "throttle-debounce";

export default function configureStore(history: History) {
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [
    createRouterMiddleware(history),
    sagaMiddleware,
    createLogger({ collapsed: true }),
  ];

  const store = createStore(
    createRootReducer(history),
    { ...createDefaultState(), ...deserializeState() },
    applyMiddleware(...middlewares)
  );

  sagaMiddleware.run(createRootSaga());

  store.subscribe(() => {
    const state = store.getState();
    try {
      for (let key of toPersist) {
        window.localStorage.setItem(key, JSON.stringify(state[key]));
      }
    } catch (e) {
      // out of space again!
      console.error(e);
    }
  });

  return store;
}

const toPersist: LocalStorageKeys = [
  // "Pokemon",
  "Ability",
  "EvolutionChain",
  "PokemonColor",
  "PokemonForm",
  "PokemonSpecies",
  "PokemonLocationAreas",
  "Move",
  "Region",
  "Location",
  "LocationArea",
];

function deserializeState(): object {
  let deserializedState: any = {};
  try {
    deserializedState = toPersist
      .map((key) => {
        let serialized = window.localStorage.getItem(key) as any;
        return [key, JSON.parse(serialized)];
      })
      .reduce((acc, [key, state]) => {
        if (state !== null) acc[key] = state;
        return acc;
      }, {} as any);
  } catch (e) {
    console.error(e);
  }
  return deserializedState;
}
