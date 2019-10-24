import React, {Component} from 'react';
import './fireworks.css';


class Fireworks extends Component{
    constructor(props){
        super(props);
    }

    render() {
        if(this.props.status !== "win"){
            return null;
        }
        return(
            <div class="pyro">
                <div className="before"></div>
                <div className="after"></div>
            </div>
        )
    }
}

export default Fireworks;