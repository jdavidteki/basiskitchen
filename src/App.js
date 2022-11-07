import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout.js"
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import "./App.css";

window.onresize = function() {
  document.getElementsByClassName("App").height = window.innerHeight;
}
window.onresize();


const stripePromise = loadStripe("pk_test_6pRNASCoBOKtIshFeQd4XMUh");


class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-content">
          <Switch>
            <Route path="/" exact component={() => (<Layout pageName="basiskitchen" />)}/>
            <Route path="/basiskitchen"  exact component={() => (<Layout pageName="basiskitchen" />)}/>
            <Route path="/rimicard/:id" exact component={() => (<Layout pageName="rimicard" />)}/>
            <Route path="/purchasereel" exact component={() => (<Layout pageName="purchasereel" />)}/>
            <Route path="/orders/:id" exact component={() => (<Layout pageName="orders" />)}/>
            <Route path="/aboutme" exact component={() => (<Layout pageName="aboutme" />)}/>
            <Route path="/messages" exact component={() => (<Layout pageName="messages" />)}/>
            <Route path="/admin/:id" exact component={() => (<Layout pageName="admin" />)}/>
          </Switch>
        </div>
      </div>
    );
  }
}

//this comment is to trigger a rebuild
export default App;
