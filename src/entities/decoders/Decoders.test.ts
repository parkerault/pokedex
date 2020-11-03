import * as E from "fp-ts/Either";
import { Errors } from "io-ts";
import Reporter from "io-ts-reporters";
import * as D from "./Decoders";
import berryFirmnessData from "./fixtures/berryFirmness.json";
import berryData from "./fixtures/berry.json";
import berryFlavorData from "./fixtures/berryFlavor.json";
import contestTypeData from "./fixtures/contestType.json";
import contestEffectData from "./fixtures/contestEffect.json";
import superContestEffectData from "./fixtures/superContestEffect.json";
import encounterMethodData from "./fixtures/encounterMethod.json";
import encounterConditionData from "./fixtures/encounterCondition.json";
import evolutionChainData from "./fixtures/evolutionChain.json";
import locationData from "./fixtures/location.json";
import locationAreaData from "./fixtures/locationArea.json";
import palParkAreaData from "./fixtures/palParkArea.json";
import regionData from "./fixtures/region.json";
import abilityData from "./fixtures/ability.json";
import characteristicData from "./fixtures/characteristic.json";
import eggGroupData from "./fixtures/eggGroup.json";
import genderData from "./fixtures/gender.json";
import moveData from "./fixtures/move.json";
import pokemonData from "./fixtures/pokemon.json";
import pokemonLocationAreasData from "./fixtures/pokemonLocationAreas.json";
import pokemonColorData from "./fixtures/pokemonColor.json";
import pokemonFormData from "./fixtures/pokemonForm.json";
import pokemonShapeData from "./fixtures/pokemonShape.json";
import pokemonSpeciesData from "./fixtures/pokemonSpecies.json";

// test("it decodes berry", () => {
//   const result = D.Berry.decode(berryData);
//   expect(E.isRight(result), failureMessage(result)).toBe(true);
// });

/**
 * This is more of a smoke test to make sure the error reporting is working. If
 * it works once it'll work for all of the decoders.
 */
// test("it reports bad berry", () => {
//   const badData = { ...berryData, id: "foo" };
//   const result = D.Berry.decode(badData);
//   const errors = Reporter.report(result);
//   expect(errors).toEqual(['Expecting number at id but instead got: "foo"']);
// });

// test("it decodes berry firmness", () => {
//   const result = D.BerryFirmness.decode(berryFirmnessData);
//   expect(E.isRight(result), failureMessage(result)).toBe(true);
// });

// test("it decodes berry flavor", () => {
//   const result = D.BerryFlavor.decode(berryFlavorData);
//   expect(E.isRight(result), failureMessage(result)).toBe(true);
// });

// test("it decodes contest type", () => {
//   const result = D.ContestType.decode(contestTypeData);
//   expect(E.isRight(result), failureMessage(result)).toBe(true);
// });

// test("it decodes contest effect", () => {
//   const result = D.ContestEffect.decode(contestEffectData);
//   expect(E.isRight(result), failureMessage(result)).toBe(true);
// });

// test("it decodes super contest effect", () => {
//   const result = D.BerrySuperContestEffect.decode(superContestEffectData);
//   expect(E.isRight(result), failureMessage(result)).toBe(true);
// });

// test("it decodes encounter method", () => {
//   const result = D.EncounterMethod.decode(encounterMethodData);
//   expect(E.isRight(result), failureMessage(result)).toBe(true);
// });

// test("it decodes encounter condition", () => {
//   const result = D.EncounterCondition.decode(encounterConditionData);
//   expect(E.isRight(result), failureMessage(result)).toBe(true);
// });

test("it decodes evolution chain", () => {
  const result = D.EvolutionChain.decode(evolutionChainData);
  expect(E.isRight(result), failureMessage(result)).toBe(true);
});

test("it decodes location", () => {
  const result = D.Location.decode(locationData);
  expect(E.isRight(result), failureMessage(result)).toBe(true);
});

test("it decodes location area", () => {
  const result = D.LocationArea.decode(locationAreaData);
  expect(E.isRight(result), failureMessage(result)).toBe(true);
});

// test("it decodes pal park area", () => {
//   const result = D.PalParkArea.decode(palParkAreaData);
//   expect(E.isRight(result), failureMessage(result)).toBe(true);
// });

test("it decodes region", () => {
  const result = D.Region.decode(regionData);
  expect(E.isRight(result), failureMessage(result)).toBe(true);
});

test("it decodes ability", () => {
  const result = D.Ability.decode(abilityData);
  expect(E.isRight(result), failureMessage(result)).toBe(true);
});

// test("it decodes characteristic", () => {
//   const result = D.Characteristic.decode(characteristicData);
//   expect(E.isRight(result), failureMessage(result)).toBe(true);
// });

// test("it decodes egg group", () => {
//   const result = D.EggGroup.decode(eggGroupData);
//   expect(E.isRight(result), failureMessage(result)).toBe(true);
// });

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

// test("it decodes pokemon shape", () => {
//   const result = D.PokemonShape.decode(pokemonShapeData);
//   expect(E.isRight(result), failureMessage(result)).toBe(true);
// });

test("it decodes pokemon species", () => {
  const result = D.PokemonSpecies.decode(pokemonSpeciesData);
  expect(E.isRight(result), failureMessage(result)).toBe(true);
});

const failureMessage = (result: E.Either<Errors, unknown>) =>
  Reporter.report(result).join("\n");
