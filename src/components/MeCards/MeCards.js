import React, { Component } from "react";

import "./MeCards.css";

class MeCards extends Component{
  constructor(props){
    super(props);

    this.state = {
      rimis: [],
      rimisIds: [],
      filteredRimis: [],
      rimiToShow: null,
    }
  }

  render(){
    return (
        <div className="MeCards">
        </div>
    );
  }
}

export default MeCards;
