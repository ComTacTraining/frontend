import React, { Component } from "react";
import axios from "../../../axios";

import "./EvolutionForm.css";

class EvolutionForm extends Component {

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
                    <option value="Commercial Modern">Commercial Modern</option>
                    <option value="Commercial Legacy">Commercial Legacy</option>
                    <option value="Industrial Modern">Industrial Modern</option>
                    <option value="Industrial Legacy">Industrial Legacy</option>
                    <option value="Multi Family Modern">Multi Family Modern</option>
                    <option value="Multi Family Legacy">Multi Family Legacy</option>
                    <option value="Single Family Modern">Single Family Modern</option>
                    <option value="Single Family Legacy">Single Family Legacy</option>
                  </select>
                </div>
                <div className="col">
                  <label className="sr-only">Construction</label>
                  <select className="form-control" name="construction" value={this.state.construction} onChange={this.handleChange}>
                    <option>Construction...</option>
                    <option value="Conventional">Conventional</option>
                    <option value="Concrete Tilt Up">Concrete Tilt Up</option>
                    <option value="Metal Clad">Metal Clad</option>
                    <option value="Block Building">Block Building</option>
                    <option value="Metal Clad &amp; Block">Metal Clad &amp; Block</option>
                    <option value="Ordinary">Ordinary</option>
                    <option value="Lightweight">Lightweight</option>
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
                    <option value="Four Story">Four Story</option>
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
                  <select className="form-control" name="witnessedConditions" value={this.state.witnessedConditions} onChange={this.handleChange}>
                    <option>Witnessed Conditions</option>
                    <option value="Alpha">Alpha</option>
                    <option value="Bravo">Bravo</option>
                    <option value="Charlie">Charlie</option>
                    <option value="Delta">Delta</option>
                  </select>
                </div>
                <div className="col">
                    {/* Should be a multi selection */}
                  <label className="sr-only">Entry / Egress</label>
                  <input type="text" className="form-control" placeholder="Entry / Egress" name="entryEgress" value={this.state.entryEgress} onChange={this.handleChange} />
                </div>
                <div className="col">
                  <label className="sr-only">Survivability Profile</label>
                  <select className="form-control" name="survivabilityProfile" value={this.state.survivabilityProfile} onChange={this.handleChange}>
                    <option>Survivability Profile</option>
                    <option value="Marginal">Marginal</option>
                    <option value="Positive">Positive</option>
                    <option value="Negative">Negative</option>
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <label className="sr-only">Location</label>
                  <select className="form-control" name="placement" value={this.state.placement} onChange={this.handleChange}>
                    <option>Location</option>
                    <option value="Alpha">Alpha</option>
                    <option value="Bravo">Bravo</option>
                    <option value="Charlie">Charlie</option>
                    <option value="Delta">Delta</option>
                  </select>
                </div>
                <div className="col">
                  <label className="sr-only">Side</label>
                  <select className="form-control" name="side" value={this.state.side} onChange={this.handleChange}>
                    <option>Side</option>
                    <option value="Alpha">Alpha</option>
                    <option value="Bravo">Bravo</option>
                    <option value="Charlie">Charlie</option>
                    <option value="Delta">Delta</option>
                  </select>
                </div>
                <div className="col">
                  <label className="sr-only">Flowpath</label>
                  <select className="form-control" name="flowpath" value={this.state.flowpath} onChange={this.handleChange}>
                    <option>Flowpath...</option>
                    <option value="Uni-Directional">Uni-Directional</option>
                    <option value="Bi-Directional">Bi-Directional</option>
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <label className="sr-only">Type of Fire</label>
                  <select className="form-control" name="fireType" value={this.state.fireType} onChange={this.handleChange}>
                    <option>Type of Fire...</option>
                    <option value="Room &amp; Contents">Room &amp; Contents</option>
                    <option value="Structure">Structure</option>
                  </select>
                </div>
                <div className="col">
                  <label className="sr-only">Exhaust Path</label>
                  <input type="text" className="form-control" placeholder="Exhaust Path" name="exhaustPath" value={this.state.exhaustPath} onChange={this.handleChange} />
                </div>
                <div className="col">
                  <label className="sr-only">Smoke</label>
                  <select className="form-control" name="smoke" value={this.state.smoke} onChange={this.handleChange}>
                    <option>Smoke...</option>
                    <option value="Gray Laminar">Gray Laminar</option>
                    <option value="Gray Turbulent">Gray Turbulent</option>
                    <option value="Black Laminar">Black Laminar</option>
                    <option value="Black Turbulent">Black Turbulent</option>
                  </select>
                </div>
              </div>
              <div className="row">
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
                  <label className="sr-only">Intro</label>
                  <input type="text" className="form-control" placeholder="Intro" name="intro" value={this.state.intro} onChange={this.handleChange} />
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
