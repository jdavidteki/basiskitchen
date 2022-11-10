import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import "./Menu.css";
import { Money } from "@material-ui/icons";

class ConnectedMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
        menuSectionName: "Regular Beef Shawarma",
        menuOptions: [
            {
                id: 1,
                title: "Chicken Shawarma",
                price: "$10",
                description: "menu description",
                poster: "https://firebasestorage.googleapis.com/v0/b/basiskitchen-d93ed.appspot.com/o/menuImages%2FmenuImage1.png?alt=media&token=c4ae131b-aed9-41e5-834b-083348e9e4f1",
                video: "https://firebasestorage.googleapis.com/v0/b/basiskitchen-d93ed.appspot.com/o/menuVideos%2F278394309_2686492134829997_8358157508114295731_n.mp4?alt=media&token=68b96784-4d34-4de5-ad26-374e149a0a60"
            },
            {
                id: 2,
                title: "Beef Shawarma",
                price: "$10",
                description: "menu description",
                poster: "https://firebasestorage.googleapis.com/v0/b/basiskitchen-d93ed.appspot.com/o/menuImages%2FmenuImage1.png?alt=media&token=c4ae131b-aed9-41e5-834b-083348e9e4f1",
                video: "https://firebasestorage.googleapis.com/v0/b/basiskitchen-d93ed.appspot.com/o/menuVideos%2F301261923_832140191479165_7166798470396104260_n.mp4?alt=media&token=65818b67-e93b-42ef-85b3-305f5060a0ec"
            },
            {
                id: 3,
                title: "Combo (Chicken and Beef)",
                price: "$10",
                description: "menu description",
                poster: "https://firebasestorage.googleapis.com/v0/b/basiskitchen-d93ed.appspot.com/o/menuImages%2FmenuImage1.png?alt=media&token=c4ae131b-aed9-41e5-834b-083348e9e4f1",
                video: "https://firebasestorage.googleapis.com/v0/b/basiskitchen-d93ed.appspot.com/o/menuVideos%2F278394309_2686492134829997_8358157508114295731_n.mp4?alt=media&token=68b96784-4d34-4de5-ad26-374e149a0a60"
            },
            {
                id: 4,
                title: "Mega (Chicken, Beef, and Shrimp)",
                price: "$10",
                description: "menu description",
                poster: "https://firebasestorage.googleapis.com/v0/b/basiskitchen-d93ed.appspot.com/o/menuImages%2FmenuImage1.png?alt=media&token=c4ae131b-aed9-41e5-834b-083348e9e4f1",
                video: "https://firebasestorage.googleapis.com/v0/b/basiskitchen-d93ed.appspot.com/o/menuVideos%2F301261923_832140191479165_7166798470396104260_n.mp4?alt=media&token=65818b67-e93b-42ef-85b3-305f5060a0ec"
            }
        ],
        cart: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
        }
    };

  }

  videoEls = []

  componentDidMount() {
    this.videoEls.forEach((item) => {
        item &&
        item.play().catch(error => {
          console.error("Error attempting to play", error);
        });
    });
  }

  updateCart = (option, menuId) => {

    if (option == "add"){
        this.setState(prevState => {
            let cart = Object.assign({}, prevState.cart);
            cart[menuId] = prevState.cart[menuId] + 1;
            return { cart };
        })
    }else{
        this.setState(prevState => {
            let cart = Object.assign({}, prevState.cart);
            if(prevState.cart[menuId] == 0){
                cart[menuId] = 0;
            }else{
                cart[menuId] = prevState.cart[menuId] - 1;
            }
            return { cart };
        })
    }

    setTimeout(() => {this.props.returnCartItems(this.state.cart);}, 500)
  }

  render() {
    return (
      <div className="Menu">
        <div className="Menu-levelOptions Menu-eachSection">
          {this.state.menuSectionName && <h3>{this.state.menuSectionName}</h3>}

          <div className="Menu-levelOptionsGallery">
            {this.state.menuOptions.map(
              (menu, index) => (
                <div className="Menu-galleryEntry" key={index}>
                    <video
                        className="Menu-video"
                        playsInline
                        loop
                        muted
                        controls
                        alt="All the devices"
                        src={menu.video}
                        poster={menu.poster}
                        ref={ref => this.videoEls.push(ref)}
                    />
                  <div className="Menu-videoDescription">
                    <h3>{menu.title}</h3>
                    <span>{menu.price}</span>
                  </div>
                  <div className="Menu-selectItem">
                    <div className="Menu-selectItem--addToCart Menu-selectItem--updateCart" onClick={() => this.updateCart("add", menu.id)}>+</div>
                    {this.state.cart[menu.id] > 0 &&
                        <div className="Menu-selectItem--itemCount">{this.state.cart[menu.id]}</div>
                    }
                    <div className="Menu-selectItem--removeFromCart Menu-selectItem--updateCart" onClick={() => this.updateCart("remove", menu.id)}>-</div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

let Menu = withRouter(connect(mapStateToProps)(ConnectedMenu));
export default withRouter(Menu);
