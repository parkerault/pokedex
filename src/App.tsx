import React, { useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Home from "Home";

import "index.css";
import "fonts.css";
import "App.css";
import TitleBar from "views/TitleBar";
import { useDispatch } from "react-redux";
import { PokemonActions } from "entities/Pokemon";
import { RootDispatch } from "config/types";
import { Pokemon } from "views/Pokemon";
import { PokemonSearchActions } from "features/PokemonSearch";

const App = () => {
  const dispatch = useDispatch<RootDispatch>();
  useEffect(() => {
    dispatch(PokemonActions.fetchIndex());
  }, []);
  return (
    <>
      <TitleBar></TitleBar>
      <Switch>
        <Route exact={true} path="/">
          <Redirect to="/pokemon" />
        </Route>
        <Route exact={true} path="/pokemon" component={Home} />
        <Route path="/pokemon/:nameId" component={Pokemon} />
      </Switch>
      {/* <RouteChangeWatcher /> */}
    </>
  );
};

// const RouteChangeWatcher: React.FC = () => {
//   const dispatch = useDispatch<RootDispatch>();
//   useEffect(() => {
//     // Clear the search input on page navigation
//     const onPageShow = () => dispatch(PokemonSearchActions.setInputState(""));
//     window.addEventListener("pageshow", onPageShow);
//     return () => window.removeEventListener("pageshow", onPageShow);
//   }, []);
//   return null;
// };

export default App;
