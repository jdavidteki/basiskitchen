import React, { Component } from "react";
import logo from '../../assets/logos/logo.png';

import { GetSvgIcon } from "../../Helpers/Helpers.js";

import "./Header.css";

class Header extends Component{
  constructor(props){
    super(props);

    this.state = {
      catSelected: "basiskitchen",
      findMeIconHover: "#800020",
    }
  }

  handleCategoryClick(catSelected){
    this.setState({
      findMeIconHover: "black",
      createIconHover: "black",
      meCardsIconHover: "black",
    })

    if(catSelected == "basiskitchen"){
      this.setState({ findMeIconHover: "#800020"})
    }else if(catSelected == "aboutme"){
      this.setState({ createIconHover: "#800020"})
    }else if(catSelected == "mecards"){
      this.setState({ meCardsIconHover: "#800020"})
    }

    this.props.changePage(catSelected)
  }

  componentDidMount(){
    let path = window.location.pathname;
    this.setState({
      findMeIconHover: path.includes("basiskitchen/") || path.includes("rimicard") ? "#800020" : 'black',
      createIconHover: path.includes("aboutme/") ? "#800020" : 'black',
      meCardsIconHover: path.includes("mecards/") ? "#800020" : 'black',
    })
  }

  render(){
    return (
      <div className="Header">
        <div className="Header-logoWrapper" onClick={() => this.handleCategoryClick("basiskitchen")}>
          <img className="Header-logo" src={logo} alt="basiskitchen.me.logo" />
        </div>
        <div className="Header-mainMenu">
          <div className="Header-mainMenu-item Header-icon" onClick={() => this.handleCategoryClick("basiskitchen")}>
            {GetSvgIcon("findMeIcon", this.state.findMeIconHover)}
            <span className="Header-img-title">basiskitchen!</span>
          </div>
          <div className="Header-mainMenu-item Header-icon" onClick={() => this.handleCategoryClick("aboutme")}>
            {GetSvgIcon("createIcon", this.state.createIconHover)}
            <span className="Header-img-title">about.me</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
