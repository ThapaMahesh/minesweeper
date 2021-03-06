import React, {Component} from 'react';
import './App.css';

import Minecontainer from './Minecontainer';

class App extends Component {
  constructor(){
    super();
    this.state = {
      sides: 0
    }

    this.mines = {0: 0, 9: 10, 16: 40, 24: 99};
  }

  renderContainer = (e) => {
    this.setState({sides: e.target.value});
  }

  render(){
    return (
      <div className="App">
        <form>
          <div className="form-field-container">
            <label>Set Difficulty: </label>
            <select value={this.state.sides} onChange={(e) => this.renderContainer(e)}>
              <option value="0" disabled>Select options</option>
              <option value="9">Beginner (9x9)</option>
              <option value="16">Intermediate (16x16)</option>
              <option value="24">Advance (24x24)</option>
            </select>
          </div>
        </form>
        <Minecontainer sides={this.state.sides} mines={this.mines[this.state.sides]} />
      </div>
    );
  }
}

export default App;
