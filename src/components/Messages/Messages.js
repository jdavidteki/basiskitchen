import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import firebase from "firebase";
import Firebase from "../../Firebase/firebase.js";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import "./Messages.css"

class ConnectedMessages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chats: [],
      content: "",
      user: null,
      readError: null,
      writeError: null,
      loadingChats: false,
      item: null,
      sellerName: "",
      dealAmount: "",
      itemOnDeal: "no",
      dealNotDeclined: "yes",
    };

    let buyerToUse = "";
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    this.setState({ readError: null, loadingChats: true });
    const chatArea = this.myRef.current;

    this.getSellerName();
    this.buyerToUse = "23432343";

    if (this.userIsSeller()) {
      //   this.buyerToUse = this.props.location.state.clickedBuyerId
    }

    //load chats on app iniitalization, and when a new chat is sent
    try {
        firebase
        .database()
        .ref(
          "chats/KNDscGlm0gUHcp5H6ASSR0UrpY42/1/XxT0TlxMPMZEm3MhBptuKeIggzo2/"
        )
        .on("value", (snapshot) => {
          let chats = [];
          snapshot.forEach((snap) => {
            chats.push(snap.val());
          });

          chats.sort(function(a, b) {
            return a.timestamp - b.timestamp;
          });
          this.setState({ chats });

          if (chatArea != null) {
            chatArea.scrollBy(0, chatArea.scrollHeight);
          }

          this.setState({ loadingChats: false });
        });
    } catch (error) {
      console.log("error", error);
      this.setState({ readError: error.message, loadingChats: false });
    }
  }

  userIsSeller = () => {
    return false;
    // return this.state.item.sellerId == this.state.user.uid
  };

  handleChange(event) {
    this.setState({
      content: event.target.value,
    });
  }

  handleDealChange = (event) => {
    this.setState({
      dealValue: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ writeError: null });
    const chatArea = this.myRef.current;

    if (this.state.content.length > 0) {
        Firebase.postChats(
            "KNDscGlm0gUHcp5H6ASSR0UrpY42",
            "XxT0TlxMPMZEm3MhBptuKeIggzo2",
            this.state.content,
            "1",
            "XxT0TlxMPMZEm3MhBptuKeIggzo2"
        )
        .then((val) => {
            this.setState({ content: "" });
            chatArea.scrollBy(0, chatArea.scrollHeight);
        })
        .catch((error) => {
            this.setState({ writeError: error.message });
        });
    }
  };

  handleDealClick = (event) => {
    event.preventDefault();
    if (!isNaN(this.state.dealValue)) {
      Firebase.sealDeal(
        this.state.item.sellerId,
        this.props.match.params.id,
        ""
      );
      Firebase.sendNewDeal(
        this.state.item.sellerId,
        this.buyerToUse,
        this.props.match.params.id,
        this.state.dealValue
      );
    } else {
      this.setState({ dealError: "Ivalid Deal Number" });
    }
  };

  getSellerName = () => {
    this.setState({ sellerName: "Basiss kitchen" });
  };

  formatTime(timestamp) {
    const d = new Date(timestamp);
    const time = `${d.getDate()}/${d.getMonth() +
      1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
    return time;
  }

  render() {

    // if user goes to a random url like http://localhost:19006/idken/Messages/7 without logging, they should be redirected to the login page and then redirected to that page
    // if (this.props.loggedInUser == null){
    //   this.props.history.push("/idken/login")
    //   return null
    // }

    return (
      <div className="Messages-area-container">
        <div
          className="Messages-area-header"
          style={{
            marginTop: 20,
            marginBottom: 20,
            fontSize: 22,
          }}
        >
          <span>Negotiations about {"item log"}</span>
          <p>
            {"logged in username"}
            ---****---
            {this.props.location.state != null
              ? this.props.location.state.clickedBuyerName
              : this.state.sellerName}
          </p>
        </div>

        <div className="Messages-area" ref={this.myRef}>
          {/* loading indicator */}
          {this.state.loadingChats ? (
            <div className="spinner-border text-success" role="status">
              <CircularProgress className="circular" />;
            </div>
          ) : (
            ""
          )}
          {/* chat area */}
          {this.state.chats.map((chat) => {
            return (
              <p
                key={chat.timestamp}
                // className={
                //   "Messages-bubble " +
                //   ("this.state.user.uid" === chat.uid ? "current-user" : "")
                // }
              >
                {chat.content}
                <br />
                <span className="Messages-time float-right">
                  {this.formatTime(chat.timestamp)}
                </span>
              </p>
            );
          })}
        </div>

        <div className="Messages-area-sendmsg">
          <form onSubmit={this.handleSubmit} className="mx-3">
            <textarea
              className="form-control"
              name="content"
              onChange={this.handleChange}
              value={this.state.content}
            ></textarea>
            {this.state.error ? (
              <p className="text-danger">{this.state.error}</p>
            ) : null}
            <Button
              variant="outlined"
              color="primary"
              type="submit"
              className="btn btn-submit px-5 mt-4"
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

let Messages = withRouter(connect(mapStateToProps)(ConnectedMessages));
export default withRouter(Messages);
