import React, { Component } from "react";
import Firebase from "../../firebase/firebase.js";
import ProgressBar from "@ramonak/react-progress-bar";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import AudioPlayer from 'react-h5-audio-player';
import cashappLogo from '../../assets/icons/cashappIcon.png';
import PlayButton from "../PlayButton/PlayButton.js"
import { GetSelectedStatusLevelLabel, GetSelectedLevelOptionAmount } from "../../Helpers/Helpers.js";
import FancyVideo from "react-videojs-fancybox";
import {HmsToSecondsOnly } from "../../helpers/Helpers.js";

var stringSimilarity = require("string-similarity");

import 'react-h5-audio-player/lib/styles.css';
import "./Orders.css";

class ConnectedOrders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailAddress: "",
      firstName: "",
      popularLines: [],
      id: "",
      igname: "",
      lastName: "",
      reelDuration: "",
      reelPurpose: "",
      reelSampleLink: "",
      selectedLevelOption: "",
      audioPlaying: false,
    };
  }

  componentDidMount() {
    if (this.props != undefined) {
      if (this.props?.match?.params?.id != undefined) {
        Firebase.getReelOrderById(this.props.match.params.id).then((val) => {
          this.setState({
            id: val.id,
            emailAddress: val.emailAddress,
            firstName: val.firstName,
            igname: val.igname,
            lastName: val.lastName,
            reelDuration: val.reelDuration,
            reelPurpose: val.reelPurpose,
            reelSampleLink: val.reelSampleLink,
            selectedLevelOption: val.selectedLevelOption,
            statusValue: val.statusValue,
            statusLabel: GetSelectedStatusLevelLabel(val.statusValue),
            dueDateSelected: val.dueDateSelected,
            orderAudioURL: val.orderAudioURL,
            snippetVideoURL: val.snippetVideoURL,
            audioIdToUse: val.audioIdToUse,
          });
        });
      }
    }
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

  playVocal = () => {
    Firebase.getRimiSenTitles()
    .then(val => {
      let begSenTitleObj = this.getBegSenTitle(this.state.audioIdToUse, val)
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

  render() {
    if (this.state.id) {
      return (
        <div className="Orders l-container">
          <h1 className="Orders-header">Order Details</h1>
          <ProgressBar
            completed={this.state.statusValue ? this.state.statusValue : '20'}
            customLabel={this.state.statusLabel ? this.state.statusLabel : 'idea generation'}
            className="Orders-progressBar"
            bgColor="#f5ab3c"
            animateOnRender
            baseBgColor="#f7de8b"
            height="20px"
            labelSize="9px"
          />
          <div className="Orders-details">
            <div className="Orders-details-level">
              <div className="Orders-orderThings">
                <div className="Orders-orderThings-top">Order Reference</div>
                <div className="Orders-orderThings-mid">{this.state.id}</div>
                <div className="Orders-orderThings-bottom">. .</div>
              </div>
              <div className="Orders-orderThings">
                <div className="Orders-orderThings-top">Owner</div>
                <div className="Orders-orderThings-mid">
                  {this.state.lastName}, {this.state.firstName}
                </div>
                <div className="Orders-orderThings-bottom">. .</div>
              </div>
            </div>
            <div className="Orders-details-level">
              <div className="Orders-orderThings">
                <div className="Orders-orderThings-top">Date Due</div>
                <div className="Orders-orderThings-mid">
                  {this.state.dueDateSelected}
                </div>
                <div className="Orders-orderThings-bottom">. .</div>
              </div>
              <div className="Orders-orderThings">
                <div className="Orders-orderThings-top">Pricing Selected</div>
                <div className="Orders-orderThings-mid">
                  {this.state.selectedLevelOption}
                </div>
                <div className="Orders-orderThings-bottom">
                  ${GetSelectedLevelOptionAmount(this.state.selectedLevelOption)}
                </div>
              </div>
            </div>
          </div>

          <div className="Orders-moreDetails">
            {this.state.audioIdToUse &&
              <div className="Orders-infoCard">
                <div className="Orders-infoCard-title">Order Audio ID</div>
                <div className="Orders-infoCard-infoDetails">
                  <div className="Orders-playButtonSection" onClick={this.playVocal}>
                    <div className="Orders-playButton">
                      <PlayButton audioPlaying={this.state.audioPlaying} />
                    </div>
                    <div>{this.state.audioIdToUse.slice(10, -1).toLowerCase()}</div>
                  </div>
                </div>
              </div>
            }

            {this.state.snippetVideoURL && (
              <div className="Orders-infoCard">
                <div className="Orders-infoCard-title">Video Snippet</div>
                <div className="Orders-infoCard-infoDetails">
                  <FancyVideo
                    source={this.state.snippetVideoURL}
                    poster="https://firebasestorage.googleapis.com/v0/b/basiskitchen-d93ed.appspot.com/o/images%2FScreen%20Shot%202022-10-18%20at%202.38.47%20PM.png?alt=media&token=1f64edde-6b4a-499e-8e93-83edb5d5f67b"
                    id={"sintel3"}
                    fitToView={true}
                  />
                </div>
              </div>
            )}
            {this.state.igname && (
              <div className="Orders-infoCard">
                <div className="Orders-infoCard-title">IG Name</div>
                <div className="Orders-infoCard-infoDetails">{this.state.igname}</div>
              </div>
            )}
            {this.state.reelDuration && (
              <div className="Orders-infoCard">
                <div className="Orders-infoCard-title">Reel Duration</div>
                <div className="Orders-infoCard-infoDetails">{this.state.reelDuration}</div>
              </div>
            )}
            {this.state.reelPurpose && (
              <div className="Orders-infoCard">
                <div className="Orders-infoCard-title">Add-Ons</div>
                <div className="Orders-infoCard-infoDetails">{this.state.reelPurpose}</div>
              </div>
            )}
            {this.state.reelSampleLink && (
              <div className="Orders-infoCard Orders-reelSampleLink" onClick={() => location.href = this.state.reelSampleLink}>
                <div className="Orders-infoCard-title">Reel Sample Link</div>
                <div className="Orders-infoCard-infoDetails">
                  {this.state.reelSampleLink}
                </div>
              </div>
            )}
            {this.state.orderAudioURL && (
              <div className="Orders-infoCard">
                <div className="Orders-infoCard-title">Voice Note</div>
                <div className="Orders-infoDetails">
                  <AudioPlayer
                    className={"Orders-audio"}
                    controlsList="nodownload"
                    src={this.state.orderAudioURL}
                  />
                </div>
              </div>
            )}
            <div className="Orders-infoCard Orders-cashApp" onClick={() => location.href = `https://cash.app/$Basiratharoon/${GetSelectedLevelOptionAmount(this.state.selectedLevelOption)}`}>
              <div className="Orders-infoCard-title">Make Payment</div>
              <div className="Orders-infoDetails">
                <img className="Orders-cashApp-Logo" src={cashappLogo} alt="cashapp.logo"/>
              </div>
            </div>

          <div className="Orders-audioPlayer">
            <audio
              style={{display:"none"}}
              className={"Orders-audio"}
              ref={ref => this.audio = ref}
              id="sample"
              crossOrigin="anonymous"
              controls
            />
          </div>

          </div>
        </div>
      );
    } else {
      return <div className="l-container">basiskitchening...</div>;
    }
  }
}

const mapStateToProps = (state) => {
  return {};
};

let Orders = withRouter(connect(mapStateToProps)(ConnectedOrders));
export default withRouter(Orders);
