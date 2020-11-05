import { createCachedSelector } from "re-reselect";
import { RootState } from "config/types";
import { PokemonSelectors } from "./Pokemon";
import { PokemonSpeciesSelectors } from "./PokemonSpecies";
import { EvolutionChainSelectors } from "./EvolutionChain";
import { PokemonLocationAreasSelectors } from "./PokemonLocationAreas";
import { MoveSelectors } from "./Move";
import memoizeOne from "memoize-one";
import { INamedAPIResource } from "./decoders/Decoders";
import { PokemonSearchSelectors } from "features/PokemonSearch";

const byName = (_: RootState, props: { name: string }) => props.name;
// const byUrl = (_: RootState, props: { url : string }) => props.url;

const pokemonAbilities = createCachedSelector(
  PokemonSelectors.byName,
  (pokemon) => pokemon?.abilities.map((a) => a.ability.name) ?? []
)(byName);

const pokemonColor = createCachedSelector(
  PokemonSelectors.byName,
  PokemonSpeciesSelectors.collection,
  (pokemon, specieses) => specieses[pokemon?.species.name ?? ""]?.color.name
)(byName);

const pokemonEvolutionChain = createCachedSelector(
  PokemonSelectors.byName,
  PokemonSpeciesSelectors.collection,
  EvolutionChainSelectors.collection,
  (pokemon, specieses, evolutions) => {
    const species = specieses[pokemon?.species.name ?? ""];
    return evolutions[species?.evolution_chain.url ?? ""];
  }
)(byName);

const pokemonGenders = createCachedSelector(
  PokemonSelectors.byName,
  PokemonSpeciesSelectors.collection,
  (pokemon, specieses) =>
    specieses[pokemon?.species.name ?? ""]?.has_gender_differences
)(byName);

const pokemonLocationAreas = createCachedSelector(
  PokemonSelectors.byName,
  PokemonLocationAreasSelectors.collection,
  (pokemon, areas) => areas[pokemon?.location_area_encounters ?? ""] ?? []
)(byName);

const pokemonMoves = createCachedSelector(
  PokemonSelectors.byName,
  MoveSelectors.collection,
  (pokemon, moves) => {
    // console.log({ pokemon, moves });
    return pokemon?.moves.map((m) => moves[m.move.name]);
  }
)(byName);

const pokemonSearchList = memoizeOne(
  (state: RootState): INamedAPIResource[] => {
    const pokemonIndex = PokemonSelectors.index(state);
    const searchInput = PokemonSearchSelectors.input(state);
    return pokemonIndex.filter((idx) => idx.name.match(searchInput));
  }
);

export const MultiSelectors = {
  pokemonAbilities,
  pokemonColor,
  pokemonEvolutionChain,
  pokemonGenders,
  pokemonLocationAreas,
  pokemonMoves,
  pokemonSearchList,
};

// declare const state: RootState;
// const f = pokemonGenders(state, { name: "" });
