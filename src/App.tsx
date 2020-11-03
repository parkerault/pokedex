import React, { useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Home from "Home";

import "index.css";
import "fonts.css";
import "App.css";
import TitleBar from "views/TitleBar";
import { useDispatch } from "react-redux";
import { PokemonActions } from "entities/Pokemon";
import { RootAction, RootDispatch } from "config/types";
import { Pokemon } from "views/Pokemon";
import { ListSearch } from "views/Search";

const App = () => {
  const dispatch = useDispatch<RootDispatch>();
  useEffect(() => {
    dispatch(PokemonActions.fetchIndex());
  }, []);
  return (
    <>
      <TitleBar></TitleBar>
      <ListSearch></ListSearch>
      <Switch>
        <Route exact={true} path="/">
          <Redirect to="/pokemon" />
        </Route>
        <Route exact={true} path="/pokemon" component={Home} />
        <Route path="/pokemon/:nameId" component={Pokemon} />
      </Switch>
    </>
  );
};

export default App;
