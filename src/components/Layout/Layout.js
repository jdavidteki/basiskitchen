import React, { Component } from "react";
import Footer from "../Footer/Footer.js";
import Header  from "../Header/Header.js";
import HomePage from "../HomePage/HomePage.js"
import PurchaseReel from "../PurchaseReel/PurchaseReel.js"
import Orders from "../Orders/Orders.js"
import Messages from "../Messages/Messages.js"
import Admin from "../Admin/Admin.js"
import AboutMe from "../AboutMe/AboutMe.js"

import styles from "./Layout.css";


class Layout extends Component{
  constructor(props){
    super(props);

    this.state = {
        pageName: this.props.pageName
    }
  }

  componentDidMount(){
    document.getElementById("layoutContent").classList.add(this.state.pageName);
  }

  componentDidUpdate(){

    const layoutContent = document.getElementById("layoutContent")

    layoutContent.className = ''

    layoutContent.classList.add("Layout-content")
    layoutContent.classList.add(this.state.pageName);

    setTimeout( () => {
        document.querySelector(".Layout").clientHeight = document.querySelector(".Layout").clientHeight + layoutContent.clientHeight
    }, 3000)
  }

  changePage = (pageToChange) => {
    window.history.pushState('', 'New Page Title', '/' + pageToChange);
    this.setState({pageName: pageToChange})
  }

  render(){
    return (
        <div className="Layout">
            <div className="Layout-header">
                <Header changePage={this.changePage}/>
            </div>
            <div className="Layout-content" id="layoutContent">
                {this.state.pageName == "basiskitchen" &&
                    <HomePage changePage={this.changePage}/>
                }
                {this.state.pageName == "orders" &&
                    <Orders />
                }
                {this.state.pageName == "aboutme" &&
                    <AboutMe/>
                }
                {this.state.pageName == "purchasereel" &&
                    <PurchaseReel changePage={this.changePage}/>
                }
                {this.state.pageName == "admin" &&
                    <Admin changePage={this.changePage}/>
                }
                {this.state.pageName == "messages" &&
                    <Messages changePage={this.changePage}/>
                }
            </div>
            <div className="Layout-footer">
                <Footer />
            </div>
        </div>
    )}
}

export default Layout;
