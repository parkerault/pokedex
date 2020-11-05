import { RootDispatch } from "config/types";
import { INamedAPIResource } from "entities/decoders/Decoders";
import { MultiSelectors } from "entities/MultiSelectors";
import { PokemonSelectors } from "entities/Pokemon";
import { PokemonSearchSelectors } from "features/PokemonSearch";
import memoizeOne from "memoize-one";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
// import { AutoSizer } from "react-virtualized";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { AutoSize } from "./AutoSize";

import "./PokemonList.css";


export const PokemonList: React.FC = () => {
  const pokemonIndex = useSelector(MultiSelectors.pokemonSearchList);
  return (
    <AutoSize>
      {({ height }) => (
        <List
          itemKey={(idx, data) => data[idx].name}
          width="100%"
          height={height}
          itemCount={pokemonIndex.length}
          itemSize={96}
          itemData={pokemonIndex}
          overscanCount={10}
        >
          {PokemonListRow}
        </List>
      )}
    </AutoSize>
  );
};

export const PokemonListRow: React.FC<ListChildComponentProps> = ({
  index,
  style,
  data,
}) => {
  const name = data[index].name;
  return (
    <div
      className={index % 2 ? "list_row list_row-even" : "list_row"}
      style={style}
    >
      <div className="page">
        <Link className="list_flex unstyledLink" to={`/pokemon/${name}`}>
          <img
            className="list_sprite twoBit"
            src={`/icons/${index + 1}.png`}
            style={{
              width: `${style.height}px`,
              height: `${style.height}px`,
            }}
          />
          <div className="list_rowContent">
            {name} {">"}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PokemonList;
