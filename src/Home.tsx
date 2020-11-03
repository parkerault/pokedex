import React from "react";
import PokemonList from "./views/PokemonList";

const Home: React.FC<{}> = () => {
  return (
    <div className="home pageRoot listRoot" data-testid="home-root">
      <PokemonList></PokemonList>
    </div>
  );
};

export default Home;
