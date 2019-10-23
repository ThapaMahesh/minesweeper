import React, {Component} from 'react';

import Services from './Services';
import './Minecontainer.css';


class Minecontainer extends Component {
    constructor(props){
        super(props);
        this.services = new Services();
        this.state = {
            playboard: [],
            status: 'playing'
        }
        this.newBoardData = {};
        this.tempboard = [];
    }

    componentDidMount = () => {
        let sides = Number(this.props.sides);
        let mines = Number(this.props.mines);
        this.newBoardData = this.services.createNewMine(sides, mines);
        this.tempboard = JSON.parse(JSON.stringify( this.newBoardData.tempboard ));
        this.setState({playboard: this.newBoardData.tempboard});
    }

    componentDidUpdate = (prevprops) => {
        if(this.props.sides !== prevprops.sides){
            let sides = Number(this.props.sides);
            let mines = Number(this.props.mines);
            this.newBoardData = this.services.createNewMine(sides, mines);
            this.tempboard = JSON.parse(JSON.stringify( this.newBoardData.tempboard ));
            this.setState({playboard: this.newBoardData.tempboard});
        }
    }

    checkMine = (row, col) => {
        console.log(this.newBoardData.actualboard);
        console.log(this.state.playboard);
        if(this.newBoardData.actualboard[row][col] !== "*"){
            // check surrounding and if 8 of them don't have mine open up and check recursively for each of them
            this.showNeighbor(row, col)
            this.setState({playboard: JSON.parse(JSON.stringify( this.tempboard )) });
        }else{
            // show all mines
            this.newBoardData.minesPosition.forEach(element => {
                this.tempboard[element[0]][element[1]] = "*";
            });

            this.setState({playboard: JSON.parse(JSON.stringify( this.tempboard )), status: 'lose' });
        }
    }

    showNeighbor = (row, col) => {
        let list = [];
        let count = 0;
        // check if 8 of the neighbors are empty, if empty show all
        for (let i = row-1; i < row+2; i++) {
            for (let j = col-1; j < col+2; j++) {
                if(i < 0 || j < 0 || i > this.props.sides || j > this.props.sides){
                    continue;
                }else if(row === i && col === j){
                    continue;
                }else if(this.newBoardData.actualboard[i][j] !== "*"){
                    list.push([i, j]);
                    continue;
                }else{
                    ++count;
                    break;
                }
            }
        }
        this.tempboard[row][col] = (this.newBoardData.actualboard[row][col] === 0) ? "" : this.newBoardData.actualboard[row][col];
        if(count === 0){
            // none of the neighbor is a mine so show them all
            list.forEach(element => {
                if(this.tempboard[element[0]][element[1]] === 0){
                    this.tempboard[element[0]][element[1]] = (this.newBoardData.actualboard[element[0]][element[1]] === 0) ? "" : this.newBoardData.actualboard[element[0]][element[1]];
                    this.showNeighbor(element[0], element[1]);
                }
            });
        }
    }

    render(){
        
        return (
            <div className="MineContainer">
                {this.state.playboard.map((rowArray, row) => {
                return (
                    <div key={row} className="row">
                        { rowArray.map((item, col) => <div data-item={item} className={(item === 0) ? "col" : "displaycol"} onClick={() => this.checkMine(row, col)}>{(item === 0) ? "" : item}</div>)}
                    </div>
                )
            })
            }
            <Timer />
            </div>
        );
    }
}

export default Minecontainer;
