import React, { Component } from "react";
import cx from 'classnames';

import "./LeftRightMovement.css";

var thisInterval = null

var screenHeight = window.innerHeight - 75
var screenWidth = window.innerWidth

var numRowsPerLeftRightMovementRow = screenHeight / 50
var numWordsPerLeftRightMovementRow = screenWidth / 3

var totalWords = (numRowsPerLeftRightMovementRow * numWordsPerLeftRightMovementRow) / 150


class LeftRightMovement extends Component{
  constructor(props){
    super(props);
        this.state = {
            rimis: Object.values(this.props.rimis),
            rimisIds: [],
            rowRimis: [],
            totalWords: 0,
        }
    }

    componentDidMount(){
        let totalLength = 0
        let rimis = Object.values(this.props.rimis)

        for (let i = 0; i < rimis.length; i++) {
            totalLength += rimis[i].senTitle.length
        }

        this.setState({totalWords: totalWords},
        () => {
            this.showRows()
        })

        let prevRandomRimi = null
        setInterval(() => {
            if(prevRandomRimi != null){
                prevRandomRimi.classList.remove("ishovered");
            }

            let rimis = document.getElementsByClassName("LeftRightMovement-eachRimi");
            let randomRimi = rimis[Math.floor(Math.random() * rimis.length)];
            randomRimi.classList.add("ishovered");
            prevRandomRimi = randomRimi
        }, 3000)
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.filteredRimis !== this.props.filteredRimis
            && this.props.filteredRimis.length > 0)
        {
            this.setState({
                rowRimis: [],
                rimis: this.props.filteredRimis
            }, ()=> {
                clearInterval(thisInterval)

                this.showRows()
            })
        }
    }

    showRows = () => {
        let index = this.state.totalWords

        thisInterval = setInterval(() => {

            let randomRimiIndex = Math.floor(Math.random() * (this.state.rimis.length - 0) + 0);

            if (index > 0){
                this.setState({
                    flexDirection:  Math.random() > 0.5 ? "column": "row",
                    rowRimis: [...this.state.rowRimis, this.state.rimis[randomRimiIndex]]
                })

                index--
            }else{
                clearInterval(thisInterval)
            }
        }, 300)
    }

    render(){
        return (
            <div className="LeftRightMovement">
                {this.state.rowRimis.map((rimi, index) =>
                    <div
                        // style={{ minWidth: numWordsPerLeftRightMovementRow}}
                        className="LeftRightMovement-eachRimi"
                        key={index}
                        onClick={() =>this.props.showRimiCard(rimi)}
                        >
                            <div className="LeftRightMovement-underline" style={{backgroundColor: rimi.color}}></div>
                            <div>{rimi.senTitle}</div>
                            <div className="LeftRightMovement-underline" style={{backgroundColor: rimi.color}}></div>
                    </div>)
                }
            </div>
        );
    }
}

export default LeftRightMovement;
