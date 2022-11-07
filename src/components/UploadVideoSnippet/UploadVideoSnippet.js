import React, { Component } from "react";
import Avatar from '@material-ui/core/Avatar';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import TextField from "@material-ui/core/TextField";
import FancyVideo from "react-videojs-fancybox";
import Firebase from "../../firebase/firebase.js";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import FileUploader from "react-firebase-file-uploader";
import emailjs from '@emailjs/browser'

import "./UploadVideoSnippet.css"

class ConnectedUploadSeacherBck extends Component {

    state = {
        albumName: "",
        singer: "",
        title: "",
        lyrics: "",
        videoID: "",
        addressID: "",
        isUploading: false,
        progress: 0,
        downloadURL: "",
        orderId: "",
        errorMsg: ""
    };

    handleUploadStart = () => this.setState({ isUploading: true, progress: 0 })
    handleProgress = progress => this.setState({ progress });
    handleUploadError = error => {
        this.setState({ isUploading: false, errorMsg: error.message });
        console.error(error);
    };

    handleUploadSuccess = filename => {
        let videoURL = `https://firebasestorage.googleapis.com/v0/b/basiskitchen-d93ed.appspot.com/o/videoSnippets%2F${this.state.orderId}.mp4?alt=media&token=844dba51-d9f5-4bf3-9e9b-7fb8b38429a1`
        this.setState({ downloadURL: videoURL, avatarOnFile: true });
        Firebase.updateVideoSnippetURL(this.state.orderId, videoURL)
        .then(() => {
            this.sendEmail(this.state.orderId)
        });
    };

    sendEmail(orderId){
        Firebase.getReelOrderById(orderId).then((val) => {

            let message =  `
            We are letting you know that your order: (${orderId}) is ready!

            You should be able to see a snippet in the VIDEO SNIPPET section here
            here: https://www.basiskitchen.com/orders/${orderId}
            `

            var templateParams = {
                to_name: val.firstName,
                from_name: 'basiskitchen',
                message: message,
                recipient_email: val.emailAddress,
                sender_email: "jesuyedd@gmail.com",
                order_id: orderId
            };

            emailjs.send('service_yn2l3x8', 'template_nnb32k5', templateParams, 'VSKnf4Vspvt3LgOiz')
            .then( (response) => {
                console.log('SUCCESS!', response.status, response.text);
                this.setState({errorMsg: "video snippet email sent to" + val.emailAddress})
            }, () => {
                this.setState({errorMsg: error.message})
            });
        });
    }


    render() {
        return (
            <div className="UploadVideoSnippet">
                <div style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <div
                    style={{
                        width: 320,
                        padding: 30,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column"
                    }}
                    >
                    <Avatar style={{ marginBottom: 10 }}>
                        <PhotoLibraryIcon />
                    </Avatar>
                    <div
                        style={{
                        marginBottom: 20,
                        fontSize: 24,
                        textAlign: "center"
                        }}
                    >
                        {" "}
                        Upload background image for country
                        {" "}
                    </div>
                        <TextField
                            value={this.state.orderId}
                            placeholder="Enter the order ID here"
                            onChange={e => {
                                this.setState({ orderId: e.target.value });
                            }}
                        />
                        {this.state.orderId &&
                            <form>
                                {this.state.isUploading && <p>Progress: {this.state.progress}</p>}
                                updating background image for  -- { this.state.orderId},
                                <label style={{color: '#1a4e8e', padding: 10, borderRadius: 4, cursor: 'pointer', }}>
                                    <span className="UploadVideoSnippet-image-label">Update Order's Video Snippet</span>
                                    <FileUploader
                                        hidden
                                        accept="video/*"
                                        filename={this.state.orderId}
                                        storageRef={Firebase.storage().ref('videoSnippets/')}
                                        onUploadStart={this.handleUploadStart}
                                        onUploadError={this.handleUploadError}
                                        onUploadSuccess={this.handleUploadSuccess}
                                        onProgress={this.handleProgress}
                                    />
                                </label>
                            </form>
                        }
                        <FancyVideo
                            source={this.state.downloadURL ? this.state.downloadURL : "https://firebasestorage.googleapis.com/v0/b/basiskitchen-d93ed.appspot.com/o/menuVideos%2F45381994989.mp4?alt=media&token=ec45452c-4ba6-4987-a3c2-249938b0b712"}
                            poster="https://firebasestorage.googleapis.com/v0/b/basiskitchen-d93ed.appspot.com/o/menuImages%2Fstew.png?alt=media&token=72db2c09-0ddb-49c1-a555-903b20c380cf"
                            id={"sintel3"}
                            fitToView={true}
                        />

                        {this.state.errorMsg &&
                            <span className="UploadVideoSnippet-errorMsg">{this.state.errorMsg}</span>
                        }
                    </div>
                </div>
            </div>

        )
    }
}

const mapStateToProps = state => {
    return {};
};

const UploadVideoSnippet = withRouter(connect(mapStateToProps)(ConnectedUploadSeacherBck));
export default UploadVideoSnippet;


//https://material-ui.com/components/material-icons/#material-icons