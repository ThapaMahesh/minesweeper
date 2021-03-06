import React, {Component} from 'react';
import {FaUndoAlt, FaGhost, FaFlag} from 'react-icons/fa';
import Services from './Services';
import './Minecontainer.css';
import Fireworks from './Fireworks';
import Modal from './Modal';


class Minecontainer extends Component {
    constructor(props){
        super(props);
        this.services = new Services();
        this.state = {
            playboard: [],
            status: 'playing',
            mines: 0,
            time: 0
        }
        this.timer = null; // time interval
        this.minesCount = 0; // count the remaining mines and we update the state
        this.newBoardData = {}; // hold the board data including, minesPosition and empty board
        this.tempboard = []; //temp board we update on and then finally to the state playboard
    }

    componentDidMount = () => {
        let sides = Number(this.props.sides);
        let mines = Number(this.props.mines);
        this.minesCount = mines;
        this.newBoardData = this.services.createNewMine(sides, mines);
        this.tempboard = JSON.parse(JSON.stringify( this.newBoardData.tempboard ));
        this.setState({playboard: this.newBoardData.tempboard, status: "playing", mines: mines, time: 0});
    }

    componentDidUpdate = (prevprops) => {
        if(this.props.sides !== prevprops.sides){
            this.reset();
        }
    }

    setTimer = () => {
        // on first click initiate the timer
        if(this.timer === null){
            this.timer = setInterval(() => {
                this.setState({time: this.state.time + 1});
            }, 1000);
        }
    }

    reset = () => {
        clearInterval(this.timer);
        this.timer = null;
        this.componentDidMount();
    }

    checkMine = (row, col) => {
        this.setTimer();
        if(this.tempboard[row][col] !== "F"){
            if(this.newBoardData.actualboard[row][col] !== "*"){
                // check surrounding and if 8 of them don't have mine open up and check recursively for each of them
                this.showNeighbor(row, col)
                this.setState({playboard: JSON.parse(JSON.stringify( this.tempboard )), mines: this.minesCount });
            }else{
                // show all mines
                this.newBoardData.minesPosition.forEach(element => {
                    this.tempboard[element[0]][element[1]] = "*";
                });
                clearInterval(this.timer);
                this.timer = null;
                this.setState({playboard: JSON.parse(JSON.stringify( this.tempboard )), status: 'lose' });
            }
        }
    }

    showNeighbor = (row, col) => {
        let list = [];
        let count = 0;
        // check if 8 of the neighbors are empty, if empty show all
        check_neighbor:
        for (let i = row-1; i < row+2; i++) {
            for (let j = col-1; j < col+2; j++) {
                if(i < 0 || j < 0 || i > (this.props.sides-1) || j > (this.props.sides-1)){
                    continue;
                }else if(row === i && col === j){
                    continue;
                }else if(this.newBoardData.actualboard[i][j] !== "*"){
                    list.push([i, j]);
                    continue;
                }else{
                    ++count;
                    break check_neighbor;
                }
            }
        }
        // if the position is flagged then remove the flag and update mine counter
        if(this.tempboard[row][col] === "F"){
            ++this.minesCount;
        }
        this.tempboard[row][col] = (this.newBoardData.actualboard[row][col] === 0) ? "" : this.newBoardData.actualboard[row][col];
        if(count === 0){
            // none of the neighbor is a mine so check recursively if their neighbor is not mine as well
            list.forEach(element => {
                if(this.tempboard[element[0]][element[1]] === 0 || this.tempboard[element[0]][element[1]] === "F"){
                    this.showNeighbor(element[0], element[1]);
                }
            });
        }
    }

    verifyMines = () => {
        let count = 0;
        this.newBoardData.minesPosition.forEach(eachMine => {
            if(this.tempboard[eachMine[0]][eachMine[1]] === "F"){
                ++count;
            }
        });
        
        if(count === this.newBoardData.minesPosition.length){
            clearInterval(this.timer);
            this.timer = null;
            this.setState({status: "win"});
        }
    }

    setFlags = (e, row, col) => {
        e.preventDefault();
        if(this.tempboard[row][col] === 0){
            if(this.minesCount !== 0){
                this.tempboard[row][col] = "F";
                --this.minesCount;
            }
        }
        else if(this.tempboard[row][col] === "F"){
            this.tempboard[row][col] = 0;
            ++this.minesCount;
        }
        this.setState({playboard: this.tempboard, mines: this.minesCount});
        this.verifyMines();
    }

    render(){
        if(this.props.sides === 0){
            return null;
        }
        
        return (
            <div>
                <Fireworks status={this.state.status} />
                <Modal status={this.state.status} time={this.state.time} restart={() => this.reset()} />
                <div className="MineContainer">
                    <div className="playContainer">
                        <div className="settings">
                            <div className="timer">
                                {this.state.time}
                            </div>
                            <div>
                                <button className="reset" onClick={() => this.reset()}><FaUndoAlt /></button>
                            </div>
                            <div className="mines">
                                {this.state.mines}
                            </div>
                        </div>

                        <div className="playboard">
                            {this.state.playboard.map((rowArray, row) => {
                            return (
                                <div key={row} className="row">
                                    { rowArray.map((item, col) => 
                                        <div key={row + "" + col} className={(item === 0) || (item === "F") ? "col" : "displaycol"} onClick={() => this.checkMine(row, col)} onContextMenu={(e) => this.setFlags(e, row, col)}>
                                            {
                                                (item === 0) ? "" : (
                                                    (item === "*") ? <FaGhost /> : (
                                                        (item === "F") ? <FaFlag /> : item
                                                        )
                                                    )}
                                        </div>
                                    )}
                                </div>
                                )
                            })
                            }
                        </div>
                        <p>Note: You must flag all mines to win.</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Minecontainer;
