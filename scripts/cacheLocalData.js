const fetch = require("node-fetch");
const fs = require("fs");

const apiRoot = "https://pokeapi.co/api/v2";

/**
 * This script should be run once before each build to cache the most commonly
 * used data. It will write the data to a json file that gets bundled into the
 * static output.
 */
(async function () {
  // Putting everything in one big try block for productivity :)
  try {
    const pokemons = await getPokemonRefs();
    const pokemonNames =
  } catch (e) {
    console.error(`Failed to cache local data:\n  ${e.message}`);
  }
})();

async function getPokemonRefs() {
  // It would be better to use pagination here, but this is the quick and
  // dirty version.
  const res = await fetch(apiRoot + "/pokemon/?limit=1100");
  const refs = await parseResponse(res);
  if (!refs.count) {
    throw new Error(`${apiRoot}/pokemon returned unexpected json.\n  ${refs}`);
  }
  return refs.results;
}

async function getPokemonNames(refs) {
}

function parseResponse(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`${res.url}\n  ${res.status}: ${res.statusText}`);
  }
}
