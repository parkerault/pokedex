import { RootDispatch } from "config/types";
import {
  PokemonSearchActions,
  PokemonSearchSelectors,
} from "features/PokemonSearch";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import "./Search.css";

export const ListSearch: React.FC = () => {
  return (
    <div className="searchRoot">
      <div className="page">
        <SearchInput />
      </div>
    </div>
  );
};

const SearchInput: React.FC = () => {
  const inputValue = useSelector(PokemonSearchSelectors.input);
  const dispatch = useDispatch<RootDispatch>();
  const inputId = "PokemonSearch";
  return (
    <label htmlFor={inputId}>
      <input
        id={inputId}
        type="search"
        value={inputValue}
        onChange={(e) =>
          dispatch(PokemonSearchActions.setInputState(e.target.value))
        }
        placeholder="Search for a Pokemon"
      />
    </label>
  );
};
