import React, { Component } from "react";
import Firebase from "../../firebase/firebase.js";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Multiselect from "multiselect-react-dropdown";
import FancyVideo from "react-videojs-fancybox";
import DatePicker from "react-datepicker";
import { Recorder } from "react-voice-recorder";
import validator from 'validator'
import emailjs from '@emailjs/browser'

import "./PurchaseReel.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-voice-recorder/dist/index.css";

class ConnectedPurchaseReel extends Component {
  constructor(props) {
    super(props);

    this.state = {
			selectedLevelOption: "",
			errorMsg: "",
			reelPurpose: "",
			reelDuration: "",
			reelSampleLink: "",
			igname: "",
			emailAddress: "",
			firstName: "",
			lastName: "",
			downloadURL: "",
      dueDateSelected: new Date(),

      audioDetails: {
        url: null,
        blob: null,
        chunks: null,
        duration: {
          h: null,
          m: null,
          s: null,
        },
      },

      purposeOptions: [
        { name: "Half tray peppered Ponmo $150", id: 1 },
        { name: "Zobo $5 per bottle ", id: 2 },
        { name: "Half tray asun $150", id: 3 },
        { name: "Half tray Ayamase $150", id: 4 },
        { name: "White rice 1 $30", id: 5 },
        { name: "White rice 2 $60", id: 6 },
        { name: "Ofada Elewe $5 per wrap", id: 7 },
        { name: "Half tray plaintain $50", id: 8 },
        { name: "Grilled fish platter $40", id: 9 },
      ],

      levelOptions: [
        { name: "Friendsgiving Package", id: 1 },
        { name: "Family Dinner", id: 2 },
        { name: "Get-together Package", id: 3 },
        { name: "Owanbe Package", id: 4 },
        { name: "Amala Platter", id: 5 },
      ],
    };
  }

  componentDidMount() {
		//
  }


  handleAudioStop(data) {
    this.setState({ audioDetails: data });
  }

  handleAudioUpload(orderID){
		if (this.state.audioDetails.chunks != null){
			let audioBlob = new Blob(this.state.audioDetails.chunks, {type: 'audio/mpeg'});

			Firebase.storage()
			.ref("audioFolder/")
			.child(orderID + ".mp3")
			.put(audioBlob)
			.then((url) => {
				this.setState({avatarOnFile: true });
			})
			.catch((error) => {
				this.setState({errorMsg: error.message})
			})
		}
  }

  handleRest() {
    const reset = {
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: null,
        m: null,
        s: null,
      },
    };
    this.setState({ audioDetails: reset });
  }

	placeOrder(){

		let errors = ""
		let audioRecorded = false

		//required fields
		if(this.state.firstName == ""){
			errors += " First name is empty \n"
		}

		if(this.state.lastName == ""){
			errors += " Last name is empty \n"
		}

		if(!validator.isEmail(this.state.emailAddress)){
			errors += " Email Address is invalid \n"
		}

		let orderId = (this.state.emailAddress + Date.now()).replace(/[^a-z0-9]/gi, '');
		if (this.state.audioDetails.chunks != null){
			audioRecorded = true
		}else{
			if(this.state.levelOptions == ""){
				errors += " You didn't select an item preference \n"
			}

			if(this.state.reelPurpose == ""){
				errors += " You did not enter an add-on \n"
			}

		}

		this.setState({errorMsg: errors})

		if (errors == "" ){

			let reel = {
				id: orderId,
				emailAddress: this.state.emailAddress,
				igname: this.state.igname,
				firstName: this.state.firstName,
				lastName: this.state.lastName,
				reelPurpose: this.state.reelPurpose,
				reelDuration: this.state.reelDuration,
				reelSampleLink: this.state.reelSampleLink,
        dueDateSelected: this.state.dueDateSelected.toString().substring(0, 16),
				selectedLevelOption: this.state.selectedLevelOption,
        orderAudioURL: "",
			}

      if(audioRecorded){
        let audioURL = `https://firebasestorage.googleapis.com/v0/b/basiskitchen-2a524.appspot.com/o/audioFolder%2F${orderId}.mp3?alt=media&token=22ca9d49-2743-42cf-9ebd-738e307ba023`
        reel.orderAudioURL = audioURL
				this.handleAudioUpload(orderId)
			}

			Firebase.createbasiskitchenOrder(reel)
			.then(() =>{
        this.sendEmail(orderId)

        setTimeout(() => {
          location.href = "orders/" + orderId
          // this.props.changePage("orders/" + orderId)
        }, 1000)

			})
		}

	}

  sendEmail(orderId){
    let message =  `
      We have received your order (${orderId}) and it is in the works

      In the meantime, relax, listen to some Burna Boy, and your food will be ready as soon as possible.

      You can follow the progress of your reel here: https://www.basiskitchen.com/orders/${orderId}
    `

    var templateParams = {
      to_name: this.state.firstName,
      from_name: 'basiskitchen',
      message: message,
      recipient_email: this.state.emailAddress,
      sender_email: "jesuyedd@gmail.com",
      order_id: orderId
    };

    emailjs.send('service_yn2l3x8', 'template_nnb32k5', templateParams, 'VSKnf4Vspvt3LgOiz')
    .then(function(response) {
      console.log('SUCCESS!', response.status, response.text);
    }, (error) => {
        this.setState({errorMsg: error.message})
    });
  }

  render() {
    return (
      <div className="PurchaseReel l-container">
        <h2>happy to assist you. please answer the questions below</h2>

        <div className="PurchaseReel-name PurchaseReel-eachSection">
          <h3>* First things first: what is your name?</h3>
          <TextField
            value={this.state.firstName}
            placeholder="First Name **"
            onChange={(e) => {
              this.setState({ firstName: e.target.value });
            }}
          />
					<TextField
            value={this.state.lastName}
            placeholder="Last Name **"
            onChange={(e) => {
              this.setState({ lastName: e.target.value });
            }}
          />
					<TextField
            value={this.state.emailAddress}
            placeholder="Email Address **"
            onChange={(e) => {
              this.setState({ emailAddress: e.target.value });
            }}
          />
					<TextField
            value={this.state.igname}
            placeholder="Instagram Username **"
            onChange={(e) => {
              this.setState({ igname: e.target.value });
            }}
          />
        </div>

        <div className="PurchaseReel-voiceNote PurchaseReel-eachSection">
          <h3>
            Leave us a voicenote with all the answers from the questions below
            so you don't have to answer the questions. Then hit pay at the
            bottom of this page
          </h3>

          <Recorder
            record={true}
            audioURL={this.state.audioDetails.url}
            showUIAudio
            handleAudioStop={(data) => this.handleAudioStop(data)}
            handleOnChange={(value) => this.handleOnChange(value, "firstname")}
            handleRest={() => this.handleRest()}
          />
        </div>

        <div className="PurchaseReel-levelOptions PurchaseReel-eachSection">
          <h3>* Select your pricing preference below</h3>
          <div className="PurchaseReel-levelOptionsGallery">
						<div className="PurchaseReel-galleryEntry">
              <FancyVideo
                source="https://firebasestorage.googleapis.com/v0/b/basiskitchen-2a524.appspot.com/o/menuVideos%2F72695374727.mp4?alt=media&token=c997364e-eb40-4192-b8c0-30a2d2aa153f"
                poster="https://firebasestorage.googleapis.com/v0/b/basiskitchen-2a524.appspot.com/o/menuImages%2Ffriedrice.png?alt=media&token=c4ae131b-aed9-41e5-834b-083348e9e4f1"
                id={"sintel3"}
                fitToView={true}
              />
              <div className="PurchaseReel-videoDescription">
                <h3>Friendsgiving Package: $250</h3>
                  Half pan jollof rice.
                  Half pan fried rice.
                  10 pcs turkey wings.
                  Nigeria coleslaw/ Pasta Salad.
              </div>
            </div>
            <div className="PurchaseReel-galleryEntry">
              <FancyVideo
                source="https://firebasestorage.googleapis.com/v0/b/basiskitchen-2a524.appspot.com/o/menuVideos%2F45381994989.mp4?alt=media&token=ec45452c-4ba6-4987-a3c2-249938b0b712"
                poster="https://firebasestorage.googleapis.com/v0/b/basiskitchen-2a524.appspot.com/o/menuImages%2Fstew-2.png?alt=media&token=877ed329-9473-4422-bba5-1f3ff3559578"
                id={"sintel2"}
                fitToView={true}
              />
              <div className="PurchaseReel-videoDescription">
                <h3>Family Dinner: $430</h3>
                  Half tray jollof rice.
                  Half tray fried rice.
                  10 pcs turkey wings.
                  Half tray efo-riro/ Egusi.
                  10 wraps of poundo yam.
                  Nigerian coleslaw / Pasta Salad.
              </div>
            </div>
            <div className="PurchaseReel-galleryEntry">
              <FancyVideo
                source="https://firebasestorage.googleapis.com/v0/b/basiskitchen-d7606.appspot.com/o/466D8CFA-5B4B-41A2-967E-39C79E982A1B.mov?alt=media&token=7941c2d7-0312-4c98-b5fa-141ff9f90fdf"
                poster="https://firebasestorage.googleapis.com/v0/b/basiskitchen-2a524.appspot.com/o/menuImages%2Fzobo.png?alt=media&token=21483e12-4d25-4c15-93e9-960a0d3828fa"
                id={"sintel1"}
                fitToView={true}
                autoplay
              />
              <div className="PurchaseReel-videoDescription">
                <h3>Get-together Package: $880</h3>
                  1 tray jollof Rice.
                  1 tray fried rice.
                  1 tray efo / egusi Soup.
                  15-20 wraps poundo yam.
                  Half tray Gizzdodo.
                  1tray chicken/ Turkey wings.
                  Half tray Nigerian Coleslaw/Pasta salad.
              </div>
            </div>
            <div className="PurchaseReel-galleryEntry">
              <FancyVideo
                source="https://firebasestorage.googleapis.com/v0/b/basiskitchen-d7606.appspot.com/o/466D8CFA-5B4B-41A2-967E-39C79E982A1B.mov?alt=media&token=7941c2d7-0312-4c98-b5fa-141ff9f90fdf"
                poster="https://firebasestorage.googleapis.com/v0/b/basiskitchen-2a524.appspot.com/o/menuImages%2Fzobo.png?alt=media&token=21483e12-4d25-4c15-93e9-960a0d3828fa"
                id={"sintel1"}
                fitToView={true}
                autoplay
              />
              <div className="PurchaseReel-videoDescription">
                <h3>Owanbe Package: $1,200</h3>
                  1 tray jollof rice.
                  1 tray fried rice.
                  1 tray efo / egusi soup.
                  15-20 wraps poundo yam.
                  6 Grilled tilapia with fried plaintain and fried yam.
                  1 tray chicken/ Turkey.
                  Half tray Asun(spicy goat meat).
                  Half tray Nigerian Coleslaw/ pasta salad.
              </div>
            </div>
            <div className="PurchaseReel-galleryEntry">
              <FancyVideo
                source="https://firebasestorage.googleapis.com/v0/b/basiskitchen-d7606.appspot.com/o/466D8CFA-5B4B-41A2-967E-39C79E982A1B.mov?alt=media&token=7941c2d7-0312-4c98-b5fa-141ff9f90fdf"
                poster="https://firebasestorage.googleapis.com/v0/b/basiskitchen-2a524.appspot.com/o/menuImages%2Fzobo.png?alt=media&token=21483e12-4d25-4c15-93e9-960a0d3828fa"
                id={"sintel1"}
                fitToView={true}
                autoplay
              />
              <div className="PurchaseReel-videoDescription">
                <h3>Amala Platter: $350</h3>
                  Buka Stew.
                  Ewedu.
                  Gbegiri.
                  Amala 14 wraps.
              </div>
            </div>
          </div>
          <Multiselect
            options={this.state.levelOptions} // Options to display in the dropdown
            selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
            onSelect={(e) => this.setState({selectedLevelOption: e[0].name})} // Function will trigger on select event
            displayValue="name" // Property name to display in the dropdown options
            placeholder="click here to select package"
            closeOnSelect={true}
          />
        </div>

        <div className="PurchaseReel-purposeOptions PurchaseReel-eachSection">
          <h3>* Select an Add-On</h3>
          <Multiselect
            options={this.state.purposeOptions} // Options to display in the dropdown
            selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
            onSelect={(e) => this.setState({reelPurpose: e[0].name})} // Function will trigger on select event
            displayValue="name" // Property name to display in the dropdown options
            placeholder="click to select an add-on"
            closeOnSelect={true}
          />
        </div>

        <div className="PurchaseReel-dueDateSelection PurchaseReel-eachSection">
          <h3>* Select due date</h3>
          <DatePicker
            selected={this.state.dueDateSelected}
            onSelect={(e) => this.setState({dueDateSelected: e})} //when day is clicked
            onChange={(e) => this.setState({dueDateSelected: e})} //only when value has changed
            minDate={new Date()}
          />
        </div>

        <div className="PurchaseReel-sampleVideo PurchaseReel-eachSection">
          <h3>* Is there something else you need that we haven't covered?</h3>
          <TextField
            value={this.state.reelSampleLink}
            placeholder="enter brief note here"
            onChange={(e) => {
              this.setState({ reelSampleLink: e.target.value });
            }}
          />
        </div>

				<div className="PurchaseReel-placeOrder PurchaseReel-eachSection">
					{this.state.errorMsg &&
						<pre>Error(s): <br></br>{this.state.errorMsg}</pre>
					}

					<Button
						variant="contained"
						style={{backgroundColor: '#6848d8', color: 'white', marginTop: 32, marginBottom: 16}}
						onClick={() => this.placeOrder()}
					>
						Place Order
					</Button>
				</div>

				{/* <div className="PurchaseReel-stripePayment PurchaseReel-eachSection">
					<CardForm/>
				</div> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

let PurchaseReel = withRouter(connect(mapStateToProps)(ConnectedPurchaseReel));
export default withRouter(PurchaseReel);
