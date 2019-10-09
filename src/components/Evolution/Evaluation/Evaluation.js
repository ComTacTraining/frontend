import React, { Component } from 'react';

export default class Evaluation extends Component {
  state = {
    totalScore: 0,
    parSpeechKeyword: '',
    parSpeechScore: 0
  };

  componentDidMount() {}

  render() {
    const {
      initialSpeech,
      secondarySpeech,
      initialMatched,
      secondaryMatched,
      slicerMatched,
      rectoMatched,
      processArrivalMatched,
      commandingUnitMatched,
      parSpeech
    } = this.props;
    let { totalScore, parSpeechKeyword, parSpeechScore } = this.state;
    let initialKeywords = [];
    let initialScore = [];
    
    initialMatched.forEach((item, index) => {
      initialKeywords[index] = item.matchKeyword;
      initialScore[index] = 0;
      if (item.matched) {
        initialScore[index] = 5;
        totalScore = totalScore + 5;
      }
    });

    let secondaryKeywords = [];
    let secondaryScore = [];
    secondaryMatched.forEach((item, index) => {
      secondaryKeywords[index] = item.matchKeyword;
      secondaryScore[index] = 0;
      if (item.matched) {
        secondaryScore[index] = 5;
        totalScore = totalScore + 5;
      }
    });

    let slicerKeywords = [];
    let slicerScore = [];
    slicerMatched.forEach((item, index) => {
      slicerKeywords[index] = item.matchKeyword;
      slicerScore[index] = 0;
      if (item.matched) {
        slicerScore[index] = 5;
        totalScore = totalScore + 5;
      }
    });

    let rectoKeywords = [];
    let rectoScore = [];
    rectoMatched.forEach((item, index) => {
      rectoKeywords[index] = item.matchKeyword;
      rectoScore[index] = 0;
      if (item.matched) {
        rectoScore[index] = 5;
        totalScore = totalScore + 5;
      }
    });

    let processArrivalKeywords = [];
    let processArrivalScore = [];
    processArrivalMatched.forEach((item, index) => {
      processArrivalKeywords[index] = item.matchKeyword;
      processArrivalScore[index] = 0;
      if (item.matched) {
        processArrivalScore[index] = 5;
        totalScore = totalScore + 5;
      }
    });

    let commandingUnitKeyword = [];
    let commandingUnitScore = [];
    commandingUnitMatched.forEach((item, index) => {
      commandingUnitKeyword[index] = item.matchKeyword;
      commandingUnitScore[index] = 0;
      if (item.matched) {
        commandingUnitScore[index] = 5;
        totalScore = totalScore + 5;
      }
    });
    parSpeechKeyword = '';
    parSpeechScore = 0;
    if(parSpeech) {
      parSpeechKeyword = parSpeech;
      parSpeechScore = 5;
      totalScore = totalScore + 5;
    }

    return (
      <div>
        <h6>Evaluation</h6>
        <div className='text-left pl-3 pr-3 pt-3'>
          <h5>1. Did your initial report include the size of the building?</h5>
          <p>{initialSpeech}</p>
          <span>Keyword: <b>{initialKeywords[0]}</b></span>
          <span className='text-black'> User Score: {initialScore[0]}</span>

          <h5>2. Did your initial report include the height of the building?</h5>
          <p>{initialSpeech}</p>
          <span>Keyword: <b>{initialKeywords[1]}</b></span>
          <span className='text-black'> User Score: {initialScore[1]}</span>

          <h5>3. Did your initial report include the occupancy of the building?</h5>
          <p>{initialSpeech}</p>
          <span>Keyword: <b>{initialKeywords[2]}</b></span>
          <span className='text-black'> User Score: {initialScore[2]}</span>

          <h5>4. Did your initial report include witnessed conditions?</h5>
          <p>{initialSpeech}</p>
          <span>Keyword: <b>{initialKeywords[3]}</b></span>
          <span className='text-black'> User Score: {initialScore[3]}</span>

          <h5>5. Did your initial report include your initial actions?</h5>
          <p>{initialSpeech}</p>
          <span>Keyword: <b>{initialKeywords[4]}</b></span>
          <span className='text-black'> User Score: {initialScore[4]}</span>

          <h5>6. Did your initial report include your resource needs for this incident?</h5>
          <p>{initialSpeech}</p>
          <span> Keyword: <b>{initialKeywords[5]}</b></span>
          <span className='text-black'> User Score: {initialScore[5]}</span>

          <h5>7. Did you establish command and give a command post location?</h5>
          <p>{initialSpeech}</p>
          <span>Keyword: <b>{initialKeywords[6]}</b></span>
          <span className='text-black'> User Score: {initialScore[6]}</span>

          <h5>8. Did you address a 360° assessment? Did your 360° address design and construction features?</h5>
          <p>{initialSpeech}</p>
          <span>Keyword: <b>{initialKeywords[7]}</b></span>
          <span className='text-black'> User Score: {initialScore[7]}</span>

          <h5>9. Did your 360° address entry and egress points?</h5>
          <p>{secondarySpeech}</p>
          <span>Keyword: <b>{secondaryKeywords[0]}</b></span>
          <span className='text-black'> User Score: {secondaryScore[0]}</span>

          <h5>10. Did your 360° address conditions found?</h5>
          <p>{secondarySpeech}</p>
          <span>Keyword: <b>{secondaryKeywords[1]}</b></span>
          <span className='text-black'> User Score: {secondaryScore[1]}</span>

          <h5>11. Did your 360°-address interior fire travel path? Where has, the fire been? Where is, it going?</h5>
          <p>{secondarySpeech}</p>
          <span> Keyword: <b>{secondaryKeywords[2]}</b></span>
          <span className='text-black'> User Score: {secondaryScore[2]}</span>

          <h5>12. Did your 360° address a survivability profile?</h5>
          <p>{secondarySpeech}</p>
          <span>Keyword: <b>{secondaryKeywords[3]}</b></span>
          <span className='text-black'> User Score: {secondaryScore[3]}</span>

          <h5>13. Did your 360° redefine your incident priorities?</h5>
          <p></p>
          <span>Keyword: <b></b></span>
          <span className='text-black'> User Score: </span>

          
          <h5>14 Did your sequential actions include size “SLICERS”?</h5>
          <span>S : <b>{slicerKeywords[0]}</b></span> <span> User Score: {slicerScore[0]} <b>5</b> </span>
          <span>L : <b>{slicerKeywords[1]}</b></span> <span> User Score: {slicerScore[1]} <b>5</b> </span>
          <span>I : <b>{slicerKeywords[2]}</b></span> <span> User Score: {slicerScore[2]} <b>5</b> </span>
          <span>C : <b>{slicerKeywords[3]}</b></span> <span> User Score: {slicerScore[3]} <b>5</b> </span>
          <span>E : <b>{slicerKeywords[4]}</b></span> <span> User Score: {slicerScore[4]} <b>5</b> </span>
          <span>R : <b>{slicerKeywords[5]}</b></span> <span> User Score: {slicerScore[5]} <b>5</b> </span>
          <span>S : <b>{slicerKeywords[6]}</b></span> <span> User Score: {slicerScore[6]} <b>5</b> </span>

          <h5>15 Did your tactical objectives address: “RECEO-VS""? Rescue, Exposures, Confinement, Extinguishment, Overhaul, Ventilation, Salvage. </h5>
          <span>R : <b>{ rectoKeywords[0] }</b></span> <span> User Score: {rectoScore[0] }</span>
          <span>E : <b>{ rectoKeywords[1] }</b></span> <span> User Score: {rectoScore[1] }</span>
          <span>C : <b>{ rectoKeywords[2] }</b></span> <span> User Score: {rectoScore[2] }</span>
          <span>E : <b>{ rectoKeywords[3] }</b></span> <span> User Score: {rectoScore[3] }</span>
          <span>O : <b>{ rectoKeywords[4] }</b></span> <span> User Score: {rectoScore[4] }</span>
          <span>V : <b>{ rectoKeywords[5] }</b></span> <span> User Score: {rectoScore[5] }</span>
          <span>S : <b>{ rectoKeywords[6] }</b></span> <span> User Score: {rectoScore[6] }</span>

          <h5>16. Were you prepared for the incident within the incident with an effective command structure and resources?</h5>
          <p></p>
          <span>Keyword: <b></b></span>
          <span className='text-black'> User Score: </span>

          <h5>17. Did you do periodic Personnel Accountability Reports?</h5>
          <p>{parSpeech}</p>
          <span>Keyword: {parSpeechKeyword}<b></b></span>
          <span className='text-black'> User Score: {parSpeechScore}</span>

          <h5>18. Did you give an effective transfer of command report?</h5>
          <p>{commandingUnitKeyword[0]}</p>
          <span>Keyword: <b></b></span>
          <span className='text-black'> User Score: {commandingUnitScore[0]}</span>

          <h5>19. Did your transfer of command report include assignments?</h5>
          <p>{commandingUnitKeyword[1]}</p>
          <span>Keyword: <b></b></span>
          <span className='text-black'> User Score: {commandingUnitScore[1]}</span>
        </div>
      </div>
    );
  }
}
