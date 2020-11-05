import React from "react";
import { ListSearch } from "views/Search";
import PokemonList from "./views/PokemonList";

const Home: React.FC<{}> = () => {
  return (
    <>
          <ListSearch />
          <div className="home pageRoot listRoot" data-testid="home-root">
            <PokemonList />
          </div>
    </>
  );
};

export default Home;
