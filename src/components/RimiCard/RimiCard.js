import React, { Component } from "react";
import Firebase from "../../firebase/firebase.js";
import TextField from "@material-ui/core/TextField";
import PlayButton from "../PlayButton/PlayButton.js"
import {HmsToSecondsOnly } from "../../helpers/Helpers.js";


var stringSimilarity = require("string-similarity");

import "./RimiCard.css";

class RimiCard extends Component {
  constructor(props){
    super(props);

    this.state = {
      rimi: this.props.rimiToShow,
      updatedSenTitle: "",
      openUpdateRimiModal: false,
      popularLines: [],
      startOfSenTitle: "",
      rimiSenTitleSongId: "", //TODO: reimagine how we want to do this
      prevTimeoutID: 0,
      audioPlaying: false,
    }
  }

  audio=null

  componentDidMount(){
    let rimiCardId = window.location.pathname.replaceAll("/rimicard/", "")

    if(rimiCardId != ""){
      Firebase.getRimiById(rimiCardId)
      .then(val => {
        this.setState({ rimi: val })
      })
    }
  }

  componentWillUnmount(){
    this.closeModal()
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.rimiToShow !== this.props.rimiToShow){
     this.setState({rimi: this.props.rimiToShow})
    }
  }

  playVocal = () => {
    Firebase.getRimiSenTitles()
    .then(val => {
      let senTitle = this.props.rimiToShow.senTitle
      if (this.state.rimi.senTitle != undefined){
        senTitle = this.state.rimi.senTitle
      }

      let begSenTitleObj = this.getBegSenTitle(senTitle, val)
      let startOfSenTitle = begSenTitleObj[0]
      let rimiSenTitleSongId = begSenTitleObj[1]

      clearTimeout(this.state.prevTimeoutID)
      if(this.audio != null && rimiSenTitleSongId != 0){
        this.setState({audioPlaying: true})
        this.audio.setAttribute("src", `https://storage.googleapis.com/africariyoki-4b634.appspot.com/vocals/${rimiSenTitleSongId}.mp3#t=${startOfSenTitle}`)

        //wait for like 0.5sec before actually playing just incase it is paused
        setTimeout(()=>{
          if(this.audio != null) {
            this.audio.play();
            if (isFinite(startOfSenTitle)){
              this.audio.currentTime = startOfSenTitle
            }
          }
        }, 700);

        const int = setTimeout(() => {
          if(this.audio != undefined){
            this.audio.pause();
            this.setState({audioPlaying: false})
            if (isFinite(startOfSenTitle)){
              this.audio.currentTime = startOfSenTitle
            }
            clearTimeout(int)
          }
        }, 4000);
        this.setState({prevTimeoutID: int})
      }
    })
  }

  //TODO: figure out how to reduce o(n) for this
  getBegSenTitle(senTitle, songs){
    let foundLine = ""
    let secTime = 0
    let songId = 0

    for (let i = 0; i < songs.length; i++) {
      let lyricsArray = songs[i].lyrics.split("\n")

      for (let j = 0; j < lyricsArray.length; j++){
        if(stringSimilarity.compareTwoStrings(senTitle.toLowerCase().replaceAll(' ', ''), lyricsArray[j].toLowerCase().replaceAll(' ', '')) >= 0.5){
          console.log(lyricsArray[j], senTitle, songs[i].id)
          foundLine = lyricsArray[j]
          songId = songs[i].id
          break
        }
      }

      if(foundLine != ""){
        break
      }
    }

    secTime = HmsToSecondsOnly(foundLine.substring(1, 9)) + parseInt(foundLine.substring(7, 9), 10)
    return [Math.round(secTime/1000), songId]
  }

  closeModal(){
    this.setState({rimi: null})
  }

  sendForApproval(){
    if(this.state.rimi != undefined){
      let updateObj = {
        "id": this.state.rimi.id,
        "updateId": this.state.rimi.id + Date.now(),
        "newSenTitle": this.state.updatedSenTitle,
      }
      Firebase.sendForApproval(updateObj)
    }
  }

  render(){
    if(this.state.rimi != undefined && this.state.rimi.senTitle != undefined){
      return (
        <div className="RimiCard">
          <div className="RimiCard-container">
            {this.state.openUpdateRimiModal &&
              <div>
                <div>{this.state.rimi.senTitle}</div>
                <TextField
                  value={this.state.rimi.updatedSenTitle}
                  placeholder="improve this line"
                  onChange={e => { this.setState({updatedSenTitle: e.target.value})}}
                />
                <div onClick={()=> this.sendForApproval()}>submit</div>
                <div onClick={() => this.setState({openUpdateRimiModal: false})}>close</div>
              </div>
            }
            <div className="RimiCard-card">
              <div className="RimiCard-front RimiCard-side">
                <h1 className="RimiCard-logo">{this.state.rimi.senTitle}</h1>
              </div>
              <div className="RimiCard-back RimiCard-side">
                { this.props?.match?.params?.id == undefined &&
                  <div className="RimiCard-close" onClick={() => this.closeModal()}>
                    =
                  </div>
                }
                <div className="RimiCard-img-area">
                  <div className="RimiCard-inner-area">
                    <img src="https://assets.codepen.io/4927073/icon-55.jpg" alt="" />
                  </div>
                </div>
                <h3 className="RimiCard-name">{this.state.rimi.name ? "Jesuye": "David"}</h3>

                <div className="RimiCard-rimiSection">
                  <div className="RimiCard-playButton" onClick={this.playVocal}>
                    <PlayButton audioPlaying={this.state.audioPlaying} />
                  </div>
                  <div
                    className="RimiCard-senTitle"
                    style={{ color: this.state.rimi.senTitleColor}}
                    onClick={() => this.setState({openUpdateRimiModal: true})}
                  >
                    <div className="RimiCard-senTitle-circle"></div>
                    <span>{this.state.rimi.senTitle}</span>
                  </div>
                </div>

                <div className="RimiCard-social-icons">
                  {this.state.rimi.facebook &&
                    <a href={"www.facebook.com/" + this.state.rimi.facebook} className="fb"><i className="RimiCard-social-icon fab fa-facebook-f"></i>
                      {this.state.rimi.facebook}
                    </a>
                  }
                  {this.state.rimi.twitter &&
                    <a href={"www.twitter.com/" + this.state.rimi.twitter} className="twitter"><i className="RimiCard-social-icon fab fa-twitter"></i>
                      {this.state.rimi.twitter}
                    </a>
                  }
                  {this.state.rimi.instagram &&
                    <a href={"www.instagram.com/" + this.state.rimi.instagram} className="insta"><i className="RimiCard-social-icon fab fa-instagram"></i>
                      {this.state.rimi.instagram}
                    </a>
                  }
                  {this.state.rimi.tiktok &&
                    <a href={"www.tiktok.com/" + this.state.rimi.tiktok} className="yt"><i className="RimiCard-social-icon fab fa-youtube">
                      {this.state.rimi.tiktok}</i>
                    </a>
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="RimiCard-audioPlayer">
            <audio
              style={{display:"none"}}
              className={"RimiCard-audio"}
              ref={ref => this.audio = ref}
              id="sample"
              crossOrigin="anonymous"
              controls
            />
          </div>
        </div>
      );
    }else{
      return <div></div>
    }
  }
}

export default RimiCard;