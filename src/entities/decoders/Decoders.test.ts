import * as E from "fp-ts/Either";
import * as D from "./Decoders";
import evolutionChainData from "./fixtures/evolutionChain.json";
import locationData from "./fixtures/location.json";
import locationAreaData from "./fixtures/locationArea.json";
import regionData from "./fixtures/region.json";
import abilityData from "./fixtures/ability.json";
import genderData from "./fixtures/gender.json";
import moveData from "./fixtures/move.json";
import pokemonData from "./fixtures/pokemon.json";
import pokemonLocationAreasData from "./fixtures/pokemonLocationAreas.json";
import pokemonColorData from "./fixtures/pokemonColor.json";
import pokemonFormData from "./fixtures/pokemonForm.json";
import pokemonSpeciesData from "./fixtures/pokemonSpecies.json";

test("it decodes evolution chain", () => {
  const result = D.EvolutionChain.decode(evolutionChainData);
  expect(E.isRight(result), failureMessage(result)).toBe(true);
});

/**
 * This is more of a smoke test to make sure the error reporting is working. If
 * it works once it'll work for all of the decoders.
 */
test("it reports bad evolution chain", () => {
  const badData = { ...evolutionChainData, id: "foo" };
  const result = D.EvolutionChain.decode(badData);
  const errors = failureMessage(result);
  expect(errors).toEqual(
    'required property "id"\n└─ cannot decode "foo", should be number'
  );
});

test("it decodes location", () => {
  const result = D.Location.decode(locationData);
  expect(E.isRight(result), failureMessage(result)).toBe(true);
});

test("it decodes location area", () => {
  const result = D.LocationArea.decode(locationAreaData);
  expect(E.isRight(result), failureMessage(result)).toBe(true);
});

test("it decodes region", () => {
  const result = D.Region.decode(regionData);
  expect(E.isRight(result), failureMessage(result)).toBe(true);
});

test("it decodes ability", () => {
  const result = D.Ability.decode(abilityData);
  expect(E.isRight(result), failureMessage(result)).toBe(true);
});

test("it decodes gender", () => {
  const result = D.Gender.decode(genderData);
  expect(E.isRight(result), failureMessage(result)).toBe(true);
});

test("it decodes move", () => {
  const result = D.Move.decode(moveData);
  expect(E.isRight(result), failureMessage(result)).toBe(true);
});

test("it decodes pokemon", () => {
  const result = D.Pokemon.decode(pokemonData);
  expect(E.isRight(result), failureMessage(result)).toBe(true);
});

test("it decodes pokemon location areas", () => {
  const result = D.PokemonLocationAreas.decode(pokemonLocationAreasData);
  expect(E.isRight(result), failureMessage(result)).toBe(true);
});

test("it decodes pokemon color", () => {
  const result = D.PokemonColor.decode(pokemonColorData);
  expect(E.isRight(result), failureMessage(result)).toBe(true);
});

test("it decodes pokemon form", () => {
  const result = D.PokemonForm.decode(pokemonFormData);
  expect(E.isRight(result), failureMessage(result)).toBe(true);
});

test("it decodes pokemon species", () => {
  const result = D.PokemonSpecies.decode(pokemonSpeciesData);
  expect(E.isRight(result), failureMessage(result)).toBe(true);
});

const failureMessage = (result: E.Either<D.DecodeError, unknown>) =>
  E.isLeft(result)
    ? new D.DecoderError(result.left).message
    : "result is not an error";
