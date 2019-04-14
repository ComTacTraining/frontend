import React, { Component } from "react";
import axios from "../../../axios";

import "./AddEvolution.css";

class AddEvolution extends Component {
    state = {
      category: '',
      construction: '',
      street: '',
      size: '',
      height: '',
      occupancyType: '',
      witnessedConditions: '',
      entryEgress: '',
      survivabilityProfile: '',
      placement: '',
      side: '',
      flowpath: '',
      exhaustPath: '',
      smokeConditions: '',
      smokeColor: '',
      intro: '',
      approach: '',
      alpha: '',
      bravo: '',
      charlie: '',
      delta: '',
    };

    handleChange = (event) => {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      console.log('Updating ' + name + ' with ' + value);
      this.setState({ [name]: value });
    }

    handleSubmit = event => {
        event.preventDefault();
        console.log(this.state);
        axios.post( '/evolution', this.state )
          .then( response => {
            console.log('Saved...');
          })
          .catch( error => {
            console.error(error);
          });
    }

  render() {
    return(
      <div className="container-fluid">
        <div className="row justify-content-md-center">
          <div className="col-md-auto">
          <div className="alert alert-primary" role="alert">
            All video files are assumed to be in the S3 bucket ctt-video. There is no need to add an extension.
          </div>
            <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col">
                  <label className="sr-only">Type</label>
                  <select className="form-control" name="category" value={this.state.category} onChange={this.handleChange}>
                    <option>Evolution Type...</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Multi Family">Multi Family</option>
                    <option value="Single Family">Single Family</option>
                  </select>
                </div>
                <div className="col">
                  <label className="sr-only">Construction</label>
                  <select className="form-control" name="construction" value={this.state.construction} onChange={this.handleChange}>
                    <option>Construction...</option>
                    <option value="Modern">Modern</option>
                    <option value="Legacy">Legacy</option>
                  </select>
                </div>
                <div className="col">
                  <label className="sr-only">Street</label>
                  <input type="text" className="form-control" placeholder="Street" name="street" value={this.state.street} onChange={this.handleChange} />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <label className="sr-only">Size</label>
                  <select className="form-control" name="size" value={this.state.size} onChange={this.handleChange}>
                    <option>Size...</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                    <option value="Extra Large">Extra Large</option>
                  </select>
                </div>
                <div className="col">
                  <label className="sr-only">Height</label>
                  <select className="form-control" name="height" value={this.state.height} onChange={this.handleChange}>
                    <option>Height...</option>
                    <option value="Single Story">Single Story</option>
                    <option value="Two Story">Two Story</option>
                    <option value="Three Story">Three Story</option>
                    <option value="Mid Rise">Mid Rise</option>
                    <option value="High Rise">High Rise</option>
                  </select>
                </div>
                <div className="col">
                  <label className="sr-only">Occupancy Type</label>
                  <input type="text" className="form-control" placeholder="Occupancy Type" name="occupancyType" value={this.state.occupancyType} onChange={this.handleChange} />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <label className="sr-only">Witnessed Conditions</label>
                  <input type="text" className="form-control" placeholder="Witnessed Conditions" name="witnessedConditions" value={this.state.witnessedConditions} onChange={this.handleChange} />
                </div>
                <div className="col">
                  <label className="sr-only">Entry / Egress</label>
                  <input type="text" className="form-control" placeholder="Entry / Egress" name="entryEgress" value={this.state.entryEgress} onChange={this.handleChange} />
                </div>
                <div className="col">
                  <label className="sr-only">Survivability Profile</label>
                  <input type="text" className="form-control" placeholder="Survivability Profile" name="survivabilityProfile" value={this.state.survivabilityProfile} onChange={this.handleChange} />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <label className="sr-only">Location</label>
                  <input type="text" className="form-control" placeholder="Location" name="placement" value={this.state.placement} onChange={this.handleChange} />
                </div>
                <div className="col">
                  <label className="sr-only">Side</label>
                  <input type="text" className="form-control" placeholder="Side" name="side" value={this.state.side} onChange={this.handleChange} />
                </div>
                <div className="col">
                  <label className="sr-only">Flowpath</label>
                  <select className="form-control" name="flowpath" value={this.state.flowpath} onChange={this.handleChange}>
                    <option>Flowpath...</option>
                    <option value="Unidirectional">Unidirectional</option>
                    <option value="Bidirectional">Bidirectional</option>
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <label className="sr-only">Exhaust Path</label>
                  <input type="text" className="form-control" placeholder="Exhaust Path" name="exhaustPath" value={this.state.exhaustPath} onChange={this.handleChange} />
                </div>
                <div className="col">
                  <label className="sr-only">Smoke Color</label>
                  <input type="text" className="form-control" placeholder="Smoke Color" name="smokeColor" value={this.state.smokeColor} onChange={this.handleChange} />
                </div>
                <div className="col">
                  <label className="sr-only">Smoke Conditions</label>
                  <input type="text" className="form-control" placeholder="Smoke Conditions" name="smokeConditions" value={this.state.smokeConditions} onChange={this.handleChange} />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <label className="sr-only">Intro</label>
                  <input type="text" className="form-control" placeholder="Intro" name="intro" value={this.state.intro} onChange={this.handleChange} />
                </div>
                <div className="col">
                  <label className="sr-only">Approach</label>
                  <select className="form-control" name="approach" value={this.state.approach} onChange={this.handleChange}>
                    <option>Approach</option>
                    <option value="Approaches/Approach 1">Approaches/Approach 1</option>
                    <option value="Approaches/Approach 2">Approaches/Approach 2</option>
                    <option value="Approaches/Approach 3">Approaches/Approach 3</option>
                    <option value="Approaches/Approach 4">Approaches/Approach 4</option>
                    <option value="Approaches/Approach 5">Approaches/Approach 5</option>
                    <option value="Approaches/Approach 6">Approaches/Approach 6</option>
                  </select>
                </div>
                <div className="col">
                  <label className="sr-only">Alpha</label>
                  <input type="text" className="form-control" placeholder="Alpha" name="alpha" value={this.state.alpha} onChange={this.handleChange} />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <label className="sr-only">Bravo</label>
                  <input type="text" className="form-control" placeholder="Bravo" name="bravo" value={this.state.bravo} onChange={this.handleChange} />
                </div>
                <div className="col">
                  <label className="sr-only">Charlie</label>
                  <input type="text" className="form-control" placeholder="Charlie" name="charlie" value={this.state.charlie} onChange={this.handleChange} />
                </div>
                <div className="col">
                  <label className="sr-only">Delta</label>
                  <input type="text" className="form-control" placeholder="Delta" name="delta" value={this.state.delta} onChange={this.handleChange} />
                </div>
              </div>
              <div className="form-group">
                <button type="submit">Add Evolution</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default AddEvolution;
