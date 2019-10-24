import React, {Component} from 'react';
import {FaRegSmileBeam, FaRegSadCry} from 'react-icons/fa';
import './Modal.css';


class Modal extends Component{
    constructor(props){
        super(props);
    }

    render(){
        if(this.props.status === "playing"){
            return null;
        }
        let message = this.props.status === "win" ? "Congratulations! You Won." : "You Lost";
        let icon = this.props.status === "win" ? <FaRegSmileBeam /> : <FaRegSadCry />;
        return(
            <div id="myModal" class="modal">
                <div class="modal-content">
                    {/* <span onClick={() => this.props.restart()} class="close">&times;</span> */}
                    <p>
                       {icon}
                    </p>
                    <p>{message}</p>
                    <p>Time: {this.props.timer}</p>
                    <button onClick={() => this.props.restart()}>Play Again!</button>
                </div>
            </div>
        );
    }
}

export default Modal;