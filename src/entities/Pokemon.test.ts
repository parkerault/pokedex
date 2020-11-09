import { select, call, put } from "redux-saga/effects";
import { expectSaga } from "redux-saga-test-plan";
import { fetchIndex, getPokemonIndex, PokemonActions } from "./Pokemon";

test("it fetches the pokemon index", () => {
  const fakeIndex = `{
    "count": 1050,
    "next": "https://pokeapi.co/api/v2/pokemon/?offset=1&limit=1",
    "previous": null,
    "results": [
      {
        "name": "bulbasaur",
        "url": "https://pokeapi.co/api/v2/pokemon/1/"
      }
    ]
  }`;
  return expectSaga(fetchIndex)
    .provide([[call(getPokemonIndex), fakeIndex]])
    .put.resolve.actionType(PokemonActions.fetchIndexSuccess.toString())
    .run();
});
