import { Optional, RootDispatch, RootState } from "config/types";
import { AbilitySelectors } from "entities/Ability";
import {
  IAbility,
  IEvolutionChain,
  IMove,
  IPokemon,
  IPokemonColor,
  IPokemonLocationAreas,
} from "entities/decoders/Decoders";
import { MultiSelectors } from "entities/MultiSelectors";
import { PokemonActions, PokemonSelectors } from "entities/Pokemon";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import "./Pokemon.css";

export const Pokemon: React.FC<{}> = () => {
  const { nameId } = useParams<{ nameId: string }>();

  const pokemon = useSelector<RootState, Optional<IPokemon>>((state) =>
    PokemonSelectors.byName(state, { name: nameId })
  );

  const nameProp = { name: nameId ?? "" };

  const color = useSelector<RootState, Optional<string>>((state) =>
    MultiSelectors.pokemonColor(state, nameProp)
  );

  const genders = useSelector<RootState, Optional<boolean>>((state) =>
    MultiSelectors.pokemonGenders(state, nameProp)
  );

  const locationAreas = useSelector<RootState, Optional<IPokemonLocationAreas>>(
    (state) => MultiSelectors.pokemonLocationAreas(state, nameProp)
  );

  const moves = useSelector<RootState, Optional<IMove>[]>(
    (state) => MultiSelectors.pokemonMoves(state, nameProp) ?? []
  );

  const artwork = useSelector<RootState, string>((state) =>
    PokemonSelectors.artwork(state, nameProp)
  );

  const dispatch = useDispatch<RootDispatch>();

  useEffect(() => {
    if (pokemon === undefined) dispatch(PokemonActions.fetchByName(nameId));
  }, []);

  const isLoading = pokemon === undefined;
  const name = pokemon?.name ?? "Unknown";
  const placeholder = "...";

  const title = isLoading ? (
    <h1 className="Pokemon_title Pokemon_title loading">Loading...</h1>
  ) : (
    <h1 className="Pokemon_title capitalize">{name}</h1>
  );

  return (
    <div className="pokemonRoot pageRoot">
      <div className="page">
        <div className="Pokemon">
          <div className="Pokemon_artwork">
            <img
              className={artwork ? "Pokemon_img twoBit" : "Pokemon_img"}
              src={artwork}
            />
            {title}
          </div>
          <dl className="Pokemon_data">
            <dt>Abilities</dt>
            <PokemonAbilities isLoading={isLoading} pokemon={pokemon} />
            <dt>Color</dt>
            <dd className="capitalize">{color ?? placeholder}</dd>
            <dt>Evolutions</dt>
            <PokemonEvolutions isLoading={isLoading} pokemon={pokemon} />
            {genders === undefined ? null : (
              <>
                <dt>Has Gender Differences?</dt>
                <dd>{genders.toString()}</dd>
              </>
            )}
            <dt>Locations</dt>
            <PokemonLocations isLoading={isLoading} pokemon={pokemon} />
            <dt>Moves</dt>
            <PokemonMoves isLoading={isLoading} pokemon={pokemon} />
            <dd></dd>
          </dl>
        </div>
      </div>
    </div>
  );
};

interface IAttributesProps {
  isLoading: boolean;
  pokemon?: IPokemon;
}

const PokemonAbilities: React.FC<IAttributesProps> = ({
  isLoading,
  pokemon,
}) => {
  const abilities = useSelector<RootState, string[]>((state) =>
    MultiSelectors.pokemonAbilities(state, { name: pokemon?.name ?? "" })
  );
  return isLoading ? (
    Placeholder()
  ) : (
    <>
      {abilities.map((ability) => (
        <dd key={ability} className="capitalize">
          {ability}
        </dd>
      ))}
    </>
  );
};

const PokemonEvolutions: React.FC<IAttributesProps> = ({
  isLoading,
  pokemon,
}) => {
  const evolutions = useSelector<RootState, Optional<IEvolutionChain>>(
    (state) =>
      MultiSelectors.pokemonEvolutionChain(state, { name: pokemon?.name ?? "" })
  );
  const evolvesTo = evolutions?.chain.evolves_to ?? [];
  return isLoading ? (
    Placeholder()
  ) : (
    <>
      {evolvesTo.map((e) => (
        <dd key={e.species.name} className="capitalize">
          {e.species.name}
        </dd>
      ))}
    </>
  );
};
const PokemonMoves: React.FC<IAttributesProps> = ({ isLoading, pokemon }) => {
  const moves = useSelector<RootState, Optional<IMove>[]>(
    (state) =>
      MultiSelectors.pokemonMoves(state, { name: pokemon?.name ?? "" }) ?? []
  );
  return isLoading ? (
    Placeholder()
  ) : (
    <>
      {moves.map((m, i) => (
        <dd key={i} className="capitalize Pokemon_move">
          {m?.name}
        </dd>
      ))}
    </>
  );
};

const PokemonLocations: React.FC<IAttributesProps> = ({
  isLoading,
  pokemon,
}) => {
  const locations = useSelector<RootState, IPokemonLocationAreas>((state) =>
    MultiSelectors.pokemonLocationAreas(state, { name: pokemon?.name ?? "" })
  );
  return isLoading ? (
    Placeholder()
  ) : (
    <>
      {locations.map((l, i) => (
        <dd key={i} className="capitalize">
          {l?.location_area.name}
        </dd>
      ))}
    </>
  );
};

const Placeholder = () => <dd>{"Loading..."}</dd>;
